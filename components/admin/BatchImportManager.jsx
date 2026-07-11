"use client";

import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import {
  UploadCloud,
  Download,
  CheckCircle2,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { compressImageFile } from "@/lib/imageCompression";
import { slugify } from "@/lib/utils";

const TEMPLATE_HEADERS = [
  "name",
  "category",
  "price",
  "old_price",
  "fabric",
  "fit",
  "sizes",
  "badge",
  "stock",
  "description",
  "is_featured",
  "image_file",
];

const TEMPLATE_ROW = {
  name: "Costume Milano Bleu Marine",
  category: "costumes",
  price: "450",
  old_price: "",
  fabric: "Laine peignée",
  fit: "Slim",
  sizes: "46,48,50,52",
  badge: "Nouveau",
  stock: "8",
  description: "Costume deux-pièces en laine peignée, coupe ajustée.",
  is_featured: "false",
  image_file: "costume-milano.jpg",
};

function downloadTemplate() {
  const csv = Papa.unparse({
    fields: TEMPLATE_HEADERS,
    data: [TEMPLATE_HEADERS.map((h) => TEMPLATE_ROW[h])],
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "modele-import-produits.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function normalizeRow(row, categories) {
  const name = (row.name || row.nom || "").toString().trim();
  const categoryRaw = (row.category || row.categorie || "").toString().trim();
  const category =
    categories.find(
      (c) => c.slug === slugify(categoryRaw) || c.name.toLowerCase() === categoryRaw.toLowerCase()
    )?.slug || slugify(categoryRaw);

  const sizesRaw = (row.sizes || row.tailles || "").toString();
  const isFeaturedRaw = (row.is_featured ?? row.vedette ?? "").toString().trim().toLowerCase();

  return {
    name,
    slug: slugify(row.slug || name),
    category,
    price: Number(row.price || row.prix || 0) || 0,
    old_price: row.old_price || row.ancien_prix ? Number(row.old_price || row.ancien_prix) : null,
    fabric: (row.fabric || row.matiere || "").toString().trim() || null,
    fit: (row.fit || row.coupe || "").toString().trim() || null,
    sizes: sizesRaw
      ? sizesRaw.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
      : [],
    badge: (row.badge || "").toString().trim() || null,
    stock: Number(row.stock || 0) || 0,
    description: (row.description || "").toString().trim() || null,
    is_featured: ["true", "1", "oui", "yes"].includes(isFeaturedRaw),
    // image_url: only used as a fallback if no matching file is found in
    // the images zip (e.g. the CSV points at an already-hosted photo).
    image_url: (row.image_url || row.image || "").toString().trim() || null,
    // image_file: filename expected to exist inside the optional zip
    // upload, matched case-insensitively during import.
    imageFile: (row.image_file || row.image_fichier || "").toString().trim() || null,
  };
}

export default function BatchImportManager() {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [categories, setCategories] = useState([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(null); // { done, total }
  const [result, setResult] = useState(null);
  const [parseError, setParseError] = useState("");

  const [zipFile, setZipFile] = useState(null);
  const [zipEntries, setZipEntries] = useState(null); // Map<lowercase filename, JSZip file object>
  const [zipError, setZipError] = useState("");

  async function ensureCategories() {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
    return data || [];
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setParseError("");
    const cats = categories.length ? categories : await ensureCategories();

    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          if (res.errors?.length) {
            setParseError(res.errors[0].message);
          }
          setRows(res.data.map((row) => normalizeRow(row, cats)));
        },
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      setRows(json.map((row) => normalizeRow(row, cats)));
    } else {
      setParseError("Format non supporté. Utilisez un fichier .csv, .xlsx ou .xls.");
    }
  }

  async function handleZipFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setZipFile(file);
    setZipError("");
    setZipEntries(null);

    try {
      const zip = await JSZip.loadAsync(file);
      const entries = new Map();
      zip.forEach((path, entry) => {
        if (entry.dir) return;
        // Only keep the filename itself (drop any folder path inside the
        // zip) and match case-insensitively against image_file values.
        const baseName = path.split("/").pop();
        entries.set(baseName.toLowerCase(), entry);
      });
      if (entries.size === 0) {
        setZipError("Le fichier .zip ne contient aucune image.");
      }
      setZipEntries(entries);
    } catch (err) {
      setZipError("Impossible de lire ce fichier .zip : " + err.message);
    }
  }

  // Uploads one image (already extracted from the zip as a Blob) to the
  // product-images bucket, compressing it first, and returns its public
  // URL — or null if anything goes wrong (import continues regardless).
  async function uploadZipImage(blob, originalName, slug) {
    try {
      const ext = originalName.split(".").pop() || "jpg";
      const asFile = new File([blob], originalName, { type: blob.type || `image/${ext}` });
      const compressed = await compressImageFile(asFile);
      const path = `${slugify(slug)}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, compressed, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      return data.publicUrl;
    } catch (err) {
      console.warn(`Image upload failed for ${originalName}:`, err.message);
      return null;
    }
  }

  async function handleImport() {
    setImporting(true);
    setResult(null);

    const validRows = rows.filter((r) => r.name && r.category);
    const skipped = rows.length - validRows.length;

    let imagesMatched = 0;
    let imagesMissing = 0;

    // Resolve images sequentially (one upload at a time) so we can show
    // progress and avoid hammering Supabase Storage with a burst of
    // parallel uploads from a large batch.
    const preparedRows = [];
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      setProgress({ done: i, total: validRows.length });

      let imageUrl = row.image_url;

      if (row.imageFile && zipEntries) {
        const match = zipEntries.get(row.imageFile.toLowerCase());
        if (match) {
          const blob = await match.async("blob");
          const uploaded = await uploadZipImage(blob, row.imageFile, row.slug);
          if (uploaded) {
            imageUrl = uploaded;
            imagesMatched += 1;
          } else {
            imagesMissing += 1;
          }
        } else {
          imagesMissing += 1;
        }
      }

      const { imageFile, ...rest } = row;
      preparedRows.push({ ...rest, image_url: imageUrl });
    }

    setProgress({ done: validRows.length, total: validRows.length });

    const { data, error } = await supabase
      .from("products")
      .upsert(preparedRows, { onConflict: "slug" })
      .select("id");

    setImporting(false);
    setProgress(null);

    if (error) {
      setResult({ success: false, message: error.message });
      return;
    }

    const parts = [`${data?.length || preparedRows.length} produit(s) importé(s)`];
    if (imagesMatched > 0) parts.push(`${imagesMatched} image(s) téléversée(s)`);
    if (imagesMissing > 0) parts.push(`${imagesMissing} image(s) introuvable(s) dans le .zip`);
    if (skipped > 0) parts.push(`${skipped} ligne(s) ignorée(s) (nom ou catégorie manquant)`);

    setResult({ success: true, message: parts.join(", ") + "." });
    setRows([]);
    setFileName("");
    setZipFile(null);
    setZipEntries(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display italic text-2xl">Import en masse</h1>
          <p className="text-[13px] text-ink-400 mt-1">
            Ajoutez ou mettez à jour plusieurs produits d'un coup, photos incluses.
          </p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-5 py-3 border border-ink-200 text-[12px] uppercase tracking-widest2"
        >
          <Download size={15} />
          Télécharger le modèle
        </button>
      </div>

      <div className="bg-white border border-ink-100 px-6 py-8 mb-8 space-y-8">
        <div>
          <p className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-3">
            1. Fichier produits (obligatoire)
          </p>
          <div className="border-2 border-dashed border-ink-200 rounded-none px-6 py-10 text-center">
            <UploadCloud size={28} className="mx-auto mb-3 text-ink-400" strokeWidth={1.3} />
            <p className="text-sm text-ink-500 mb-4">
              Glissez un fichier .csv ou .xlsx, ou cliquez pour sélectionner.
            </p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFile}
              className="mx-auto text-sm"
            />
            {fileName && <p className="text-[12px] text-ink-400 mt-3">Fichier sélectionné : {fileName}</p>}
          </div>

          <div className="mt-6 text-[13px] text-ink-500 leading-relaxed">
            <p className="font-medium text-ink-600 mb-1.5">Colonnes attendues :</p>
            <p className="font-mono text-[12px] break-words">
              name, category, price, old_price, fabric, fit, sizes, badge, stock, description, is_featured, image_file
            </p>
            <p className="mt-2">
              La <code className="font-mono">category</code> doit correspondre au nom ou au slug d'une
              catégorie existante. <code className="font-mono">sizes</code> accepte plusieurs valeurs
              séparées par des virgules (ex : "42,44,46"). Les lignes dont le slug correspond à un produit
              existant seront mises à jour plutôt que dupliquées.
            </p>
          </div>

          {parseError && (
            <p className="mt-4 text-[13px] text-red-700 flex items-center gap-2">
              <AlertTriangle size={14} /> {parseError}
            </p>
          )}
        </div>

        <div className="border-t border-ink-100 pt-8">
          <p className="text-[12px] uppercase tracking-widest2 text-ink-500 mb-3">
            2. Photos des produits (facultatif)
          </p>
          <div className="border-2 border-dashed border-ink-200 rounded-none px-6 py-10 text-center">
            <ImageIcon size={28} className="mx-auto mb-3 text-ink-400" strokeWidth={1.3} />
            <p className="text-sm text-ink-500 mb-4">
              Mettez toutes vos photos dans un dossier, compressez-le en .zip, puis
              importez-le ici.
            </p>
            <input
              type="file"
              accept=".zip"
              onChange={handleZipFile}
              className="mx-auto text-sm"
            />
            {zipFile && zipEntries && (
              <p className="text-[12px] text-pine mt-3">
                {zipFile.name} — {zipEntries.size} image(s) détectée(s)
              </p>
            )}
            {zipError && (
              <p className="text-[12px] text-red-700 mt-3 flex items-center justify-center gap-2">
                <AlertTriangle size={13} /> {zipError}
              </p>
            )}
          </div>
          <p className="mt-4 text-[13px] text-ink-500 leading-relaxed">
            Dans votre fichier CSV/Excel, la colonne <code className="font-mono">image_file</code> doit
            contenir le <strong>nom exact du fichier image</strong> à utiliser pour chaque ligne (ex :
            "costume-milano.jpg"), et ce fichier doit se trouver dans le .zip importé ci-dessus. La
            correspondance ignore la casse (majuscules/minuscules) et les sous-dossiers éventuels dans le
            .zip. Chaque image est automatiquement compressée avant l'envoi.
          </p>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="bg-white border border-ink-100 mb-8">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 gap-4">
            <p className="text-sm font-medium">{rows.length} ligne(s) détectée(s)</p>
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-5 py-2.5 bg-ink text-ivory text-[12px] uppercase tracking-widest2 disabled:opacity-60 flex-none"
            >
              {importing
                ? progress
                  ? `Import en cours... ${progress.done}/${progress.total}`
                  : "Import en cours..."
                : "Importer ces produits"}
            </button>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest2 text-ink-400 border-b border-ink-100">
                  <th className="px-4 py-2.5">Nom</th>
                  <th className="px-4 py-2.5">Catégorie</th>
                  <th className="px-4 py-2.5">Prix</th>
                  <th className="px-4 py-2.5">Stock</th>
                  <th className="px-4 py-2.5">Tailles</th>
                  <th className="px-4 py-2.5">Photo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const hasZipMatch = row.imageFile && zipEntries?.has(row.imageFile.toLowerCase());
                  return (
                    <tr key={i} className="border-b border-ink-50">
                      <td className="px-4 py-2.5">{row.name || <span className="text-red-600">manquant</span>}</td>
                      <td className="px-4 py-2.5">{row.category || <span className="text-red-600">manquant</span>}</td>
                      <td className="px-4 py-2.5 font-mono">{row.price}</td>
                      <td className="px-4 py-2.5">{row.stock}</td>
                      <td className="px-4 py-2.5">{row.sizes.join(", ")}</td>
                      <td className="px-4 py-2.5">
                        {row.imageFile ? (
                          hasZipMatch ? (
                            <span className="text-pine">✓ {row.imageFile}</span>
                          ) : (
                            <span className="text-red-600">introuvable : {row.imageFile}</span>
                          )
                        ) : row.image_url ? (
                          <span className="text-ink-400">URL fournie</span>
                        ) : (
                          <span className="text-ink-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result && (
        <div
          className={`px-5 py-4 flex items-center gap-2 text-[13px] ${
            result.success ? "bg-pine/10 text-pine" : "bg-red-50 text-red-700"
          }`}
        >
          {result.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {result.message}
        </div>
      )}
    </div>
  );
}
