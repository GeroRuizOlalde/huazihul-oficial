alter table public.productos
  add column if not exists talles text[];

update public.productos
set talles = '{}'::text[]
where talles is null;

alter table public.productos
  alter column talles set default '{}'::text[];

alter table public.productos
  alter column talles set not null;
