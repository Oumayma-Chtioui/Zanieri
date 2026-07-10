-- ============================================================================
-- Zanieri — Test product data
-- Run after 001_schema.sql. Inserts ~24 menswear products across every
-- starter category so the storefront and admin panel have something to
-- show immediately. No images are set — add photos from /admin, or bulk
-- import a CSV with an `image_url` column via /admin/import.
-- ============================================================================

insert into products
  (slug, name, category, price, old_price, fabric, fit, sizes, badge, stock, description, is_featured, promotion_label)
values
  ('costume-milano-marine', 'Costume Milano Marine', 'costumes', 480, null, 'Laine peignée', 'Slim', '{46,48,50,52,54}', 'Nouveau', 6, 'Costume deux-pièces en laine peignée, coupe ajustée, doublure intérieure soignée. Idéal cérémonies et bureau.', true, null),
  ('costume-roma-anthracite', 'Costume Roma Anthracite', 'costumes', 460, 520, 'Laine mélangée', 'Regular', '{46,48,50,52}', 'Promo', 4, 'Costume classique anthracite, coupe confortable pour un usage quotidien au bureau.', true, '-12%'),
  ('costume-torino-gris-perle', 'Costume Torino Gris Perle', 'costumes', 510, null, 'Laine super 120''s', 'Slim', '{48,50,52,54}', null, 5, 'Une étoffe légère et fluide pour les journées longues, du matin aux réceptions du soir.', false, null),
  ('costume-cerise-mariage-ivoire', 'Costume Cérémonie Ivoire', 'costumes', 590, null, 'Laine et soie', 'Ajusté', '{48,50,52}', 'Édition limitée', 3, 'Costume de mariage en laine et soie, fini satiné sur le col. Pièce sur commande.', true, null),

  ('blazer-oxford-camel', 'Blazer Oxford Camel', 'blazers', 320, null, 'Laine et cachemire', 'Slim', '{46,48,50,52}', 'Nouveau', 7, 'Blazer camel à trois boutons, parfait pour superposer sur une chemise ou un pull fin.', true, null),
  ('blazer-prince-de-galles', 'Blazer Prince-de-Galles', 'blazers', 340, 390, 'Laine à motif', 'Regular', '{48,50,52,54}', 'Promo', 5, 'Motif Prince-de-Galles discret, doublure bordeaux, coupe intemporelle.', false, '-13%'),
  ('blazer-lin-ete-beige', 'Blazer Lin Été Beige', 'blazers', 280, null, 'Lin', 'Slim', '{46,48,50}', null, 6, 'Blazer léger en lin respirant, pensé pour les journées chaudes.', false, null),

  ('chemise-oxford-blanche', 'Chemise Oxford Blanche', 'chemises', 95, null, 'Coton Oxford', 'Regular', '{38,39,40,41,42,43,44}', null, 20, 'La chemise blanche fondamentale, en coton Oxford durable et facile d''entretien.', true, null),
  ('chemise-lin-bleu-ciel', 'Chemise Lin Bleu Ciel', 'chemises', 105, null, 'Lin', 'Slim', '{38,39,40,41,42,43}', 'Nouveau', 14, 'Chemise en lin léger, coupe ajustée, idéale pour les soirées d''été.', true, null),
  ('chemise-flanelle-carreaux', 'Chemise Flanelle Carreaux', 'chemises', 110, 130, 'Flanelle de coton', 'Regular', '{39,40,41,42,43,44}', 'Promo', 10, 'Motif carreaux chaud pour l''hiver, doublure intérieure brossée.', false, '-15%'),
  ('chemise-popeline-rayee', 'Chemise Popeline Rayée', 'chemises', 98, null, 'Popeline de coton', 'Slim', '{38,39,40,41,42}', null, 12, 'Rayures fines classiques, col français, parfaite sous un blazer.', false, null),
  ('chemise-lin-blanche-manche-courte', 'Chemise Lin Blanche Manche Courte', 'chemises', 85, null, 'Lin', 'Regular', '{39,40,41,42,43,44}', null, 15, 'Chemise manches courtes en lin, respirante pour les journées chaudes.', false, null),

  ('pantalon-flanelle-gris', 'Pantalon Flanelle Gris', 'pantalons', 145, null, 'Flanelle de laine', 'Slim', '{40,42,44,46,48}', null, 9, 'Pantalon chino habillé en flanelle, taille ajustée par ceinture élastique interne.', false, null),
  ('pantalon-lin-beige', 'Pantalon Lin Beige', 'pantalons', 120, null, 'Lin', 'Regular', '{40,42,44,46}', 'Nouveau', 11, 'Pantalon léger en lin, coupe droite, idéal pour les journées d''été.', true, null),
  ('pantalon-laine-marine', 'Pantalon Laine Marine', 'pantalons', 150, 175, 'Laine peignée', 'Slim', '{42,44,46,48,50}', 'Promo', 6, 'Assortissable au blazer Oxford Camel pour une tenue complète.', false, '-14%'),
  ('chino-coton-kaki', 'Chino Coton Kaki', 'pantalons', 110, null, 'Coton stretch', 'Slim', '{40,42,44,46}', null, 13, 'Chino confortable au quotidien, matière stretch pour plus de liberté de mouvement.', false, null),

  ('pull-col-v-cachemire', 'Pull Col V Cachemire', 'mailles', 210, null, 'Cachemire', 'Regular', '{S,M,L,XL}', 'Édition limitée', 5, 'Pull fin en cachemire, col en V, à porter seul ou sous un blazer.', true, null),
  ('gilet-sans-manches-laine', 'Gilet Sans Manches Laine', 'mailles', 165, null, 'Laine mérinos', 'Slim', '{S,M,L,XL}', null, 8, 'Gilet fin en laine mérinos, parfait pour les intersaisons.', false, null),
  ('pull-col-rond-marine', 'Pull Col Rond Marine', 'mailles', 145, 165, 'Laine mérinos', 'Regular', '{S,M,L,XL,XXL}', 'Promo', 10, 'Pull chaud et léger, coloris marine intemporel.', false, '-12%'),
  ('cardigan-boutonne-gris', 'Cardigan Boutonné Gris', 'mailles', 190, null, 'Laine et acrylique', 'Regular', '{M,L,XL}', 'Nouveau', 7, 'Cardigan boutonné, parfait pour les soirées fraîches.', false, null),

  ('ceinture-cuir-marron', 'Ceinture Cuir Marron', 'accessoires', 75, null, 'Cuir pleine fleur', null, '{}', null, 18, 'Ceinture en cuir pleine fleur, boucle discrète finition laiton brossé.', false, null),
  ('cravate-soie-bordeaux', 'Cravate Soie Bordeaux', 'accessoires', 65, null, 'Soie', null, '{}', 'Nouveau', 16, 'Cravate en soie unie, se marie avec tous les costumes de la maison.', true, null),
  ('pochette-costume-motif', 'Pochette de Costume Motif', 'accessoires', 35, null, 'Soie', null, '{}', null, 20, 'Pochette à motif discret pour rehausser une veste de costume.', false, null),
  ('boutons-manchette-argent', 'Boutons de Manchette Argentés', 'accessoires', 55, 70, 'Métal plaqué argent', null, '{}', 'Promo', 9, 'Boutons de manchette classiques, finition argentée mate.', false, '-21%')
on conflict (slug) do nothing;
