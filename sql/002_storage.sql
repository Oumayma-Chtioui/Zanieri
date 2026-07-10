-- ============================================================================
-- Zanieri — Storage buckets
-- Run after 001_schema.sql. Creates the two public buckets used by the
-- admin panel (product photos, homepage hero image) and the policies that
-- let anyone read them while only signed-in admins can upload/delete.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-banners', 'site-banners', true)
on conflict (id) do nothing;

-- Public read on both buckets (storefront images must load for anon visitors).
drop policy if exists "Public read product-images" on storage.objects;
create policy "Public read product-images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "Public read site-banners" on storage.objects;
create policy "Public read site-banners" on storage.objects
  for select using (bucket_id = 'site-banners');

-- Authenticated (admin) write access.
drop policy if exists "Admin upload product-images" on storage.objects;
create policy "Admin upload product-images" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "Admin update product-images" on storage.objects;
create policy "Admin update product-images" on storage.objects
  for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "Admin delete product-images" on storage.objects;
create policy "Admin delete product-images" on storage.objects
  for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "Admin upload site-banners" on storage.objects;
create policy "Admin upload site-banners" on storage.objects
  for insert with check (bucket_id = 'site-banners' and auth.role() = 'authenticated');

drop policy if exists "Admin update site-banners" on storage.objects;
create policy "Admin update site-banners" on storage.objects
  for update using (bucket_id = 'site-banners' and auth.role() = 'authenticated');

drop policy if exists "Admin delete site-banners" on storage.objects;
create policy "Admin delete site-banners" on storage.objects
  for delete using (bucket_id = 'site-banners' and auth.role() = 'authenticated');
