"use client";

import imageCompression from "browser-image-compression";

// Compresses an image file in the browser before it's uploaded to
// Supabase Storage, targeting ~150KB so storage/bandwidth usage stays
// predictable regardless of source photo size (e.g. straight-from-phone
// camera photos). Falls back to the original file if compression throws
// for any reason, rather than blocking the admin from saving.
export async function compressImageFile(file, overrides = {}) {
  const options = {
    maxSizeMB: 0.15,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    ...overrides,
  };

  try {
    const compressed = await imageCompression(file, options);
    // Preserve the original filename/extension for a nicer storage path.
    return new File([compressed], file.name, { type: compressed.type });
  } catch (err) {
    console.warn("Image compression failed, uploading original file:", err);
    return file;
  }
}
