# Zanieri — Boutique en ligne (Next.js + Supabase)

Site e-commerce pour une marque de prêt-à-porter homme tunisienne :
boutique publique avec commande via WhatsApp, avis clients, et panneau
d'administration complet (produits, catégories, adresses, paramètres,
avis, import en masse CSV/Excel).

## Stack technique

- **Next.js 14** (App Router), composants serveur pour tout l'affichage public
- **Tailwind CSS** — design personnalisé (voir `tailwind.config.js`)
- **Supabase** — base de données Postgres, authentification, stockage d'images
- **Déploiement recommandé : Vercel**

---

## 1. Créer le projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un nouveau projet (gratuit).
2. Dans **Project Settings → API**, notez :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (optionnel, seulement pour le script d'import local — **ne jamais l'exposer publiquement**)

## 2. Exécuter les scripts SQL

Dans Supabase, ouvrez **SQL Editor → New query**, puis exécutez **dans l'ordre** :

1. `sql/001_schema.sql` — crée toutes les tables, la sécurité (RLS), et les catégories de base.
2. `sql/002_storage.sql` — crée les buckets de stockage d'images (`product-images`, `site-banners`) et leurs permissions.
3. `sql/003_seed_products.sql` — (optionnel) ajoute ~24 produits de test pour voir le site rempli immédiatement.

Chaque script est écrit pour être rejouable sans erreur si vous devez le relancer.

## 3. Créer votre compte administrateur

Le panneau `/admin` est protégé par Supabase Auth (email + mot de passe).

1. Dans Supabase : **Authentication → Users → Add user**.
2. Entrez votre e-mail et un mot de passe. Cochez "Auto Confirm User".
3. C'est ce compte que vous utiliserez pour vous connecter sur `/admin`.

Vous pouvez créer plusieurs comptes admin de la même façon — toute
personne authentifiée a un accès complet au panneau.

## 4. Configurer le projet localement

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement et le remplir
cp .env.example .env.local
```

Remplissez `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role   # optionnel, script local uniquement
NEXT_PUBLIC_WHATSAPP_NUMBER=21600000000            # numéro par défaut, remplaçable dans /admin/settings
NEXT_PUBLIC_SITE_URL=https://www.zanieri.tn
```

```bash
# 3. Lancer le site en local
npm run dev
```

- Boutique : http://localhost:3000
- Administration : http://localhost:3000/admin

## 5. Remplir le contenu depuis /admin

Une fois connecté sur `/admin` :

| Section | Ce que vous pouvez faire |
|---|---|
| **Produits** | Ajouter/modifier/supprimer un produit, uploader une photo (compressée automatiquement), gérer les tailles, le stock, les promotions, et cocher "vedette" pour l'afficher en page d'accueil |
| **Catégories** | Ajouter vos propres catégories, réordonner leur affichage, choisir une icône ([liste complète ici](https://lucide.dev/icons)) |
| **Import en masse** | Importer plusieurs produits d'un coup via un fichier `.csv` ou `.xlsx` — téléchargez le modèle fourni dans la page pour connaître le format attendu |
| **Avis clients** | Approuver, masquer ou supprimer les avis laissés par les visiteurs |
| **Adresses** | Ajouter vos points de vente (nom, adresse, téléphone, horaires, lien Google Maps) |
| **Paramètres** | Nom de la boutique, coordonnées, réseaux sociaux, numéro WhatsApp, frais de livraison, texte et image de la page d'accueil, note Google |

### Format du fichier d'import CSV/Excel

Colonnes attendues (voir aussi le modèle téléchargeable dans `/admin/import`) :

```
name, category, price, old_price, fabric, fit, sizes, badge, stock, description, is_featured, image_url
```

- `category` doit correspondre au **nom ou au slug** d'une catégorie déjà créée.
- `sizes` accepte plusieurs valeurs séparées par des virgules, ex : `42,44,46`.
- Une ligne dont le nom donne un slug déjà existant **mettra à jour** ce produit plutôt que de le dupliquer.

### Numéro WhatsApp

Dans `/admin/settings`, entrez le numéro **avec le code pays, sans le
`+`, sans espaces** — par exemple pour la Tunisie : `21620123456`. C'est
ce numéro qui reçoit les commandes envoyées depuis le panier du site.

---

## 6. Déployer sur Vercel

1. Poussez ce projet sur GitHub (ou GitLab/Bitbucket).
2. Sur [vercel.com](https://vercel.com), importez le dépôt.
3. Dans les paramètres du projet Vercel, ajoutez les mêmes variables que dans `.env.local` (`Settings → Environment Variables`).
4. Déployez. Chaque `git push` redéploiera automatiquement le site.

Le site est configuré pour toujours afficher les données les plus
récentes de Supabase (aucune mise en cache serveur), donc vos
modifications dans `/admin` apparaissent immédiatement, sans
redéploiement.

---

## Structure du projet

```
app/
├── (site)/                 — boutique publique
│   ├── page.js              accueil
│   ├── products/page.js     catalogue avec filtres
│   ├── product/[slug]/      fiche produit
│   ├── cart/page.js         panier → commande WhatsApp
│   └── about/page.js        page "La Maison"
├── admin/                  — panneau d'administration (protégé)
│   ├── page.js               produits
│   ├── categories/
│   ├── import/               import CSV/Excel
│   ├── reviews/
│   ├── stores/
│   └── settings/
├── sitemap.js / robots.js  — SEO (admin et panier exclus de l'indexation)
components/
├── site/                   — composants de la boutique
├── cart/                   — panier (contexte, tiroir, page, commande)
└── admin/                  — composants du panneau d'administration
lib/                        — accès aux données Supabase, utilitaires
sql/                        — scripts SQL à exécuter dans Supabase
scripts/                    — outil d'import local optionnel (service role)
```

## Notes de conception

- **Style visuel** : construit à partir du logo signature Zanieri — encre
  noire sur fond ivoire, typographie serif élégante (Fraunces) associée à
  un sans-serif géométrique (Jost). Les éléments de mise en page (fiches
  produit en forme d'étiquette de vêtement, séparateurs en points de
  couture, puces en forme de goujon) sont un langage visuel propre à la
  maison plutôt que des composants génériques.
- **Panier → WhatsApp** : aucun paiement en ligne n'est intégré. Le
  bouton "Envoyer la commande" ouvre WhatsApp avec un message déjà
  rédigé (articles, tailles, quantités, total, coordonnées du client).
- **Avis clients** : tout visiteur peut soumettre un avis (étoiles +
  commentaire), mais il n'apparaît publiquement qu'après validation dans
  `/admin/reviews` — la base de données l'impose via une règle de
  sécurité (RLS), pas seulement l'interface.
