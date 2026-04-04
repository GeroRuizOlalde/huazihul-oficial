alter table public.productos
  add column if not exists visible boolean;

update public.productos
set visible = true
where visible is null;

alter table public.productos
  alter column visible set default true;

alter table public.productos
  alter column visible set not null;

alter table public.productos
  add column if not exists colores text[];

update public.productos
set colores = '{}'::text[]
where colores is null;

alter table public.productos
  alter column colores set default '{}'::text[];

alter table public.productos
  alter column colores set not null;

alter table public.productos
  add column if not exists imagenes_extra text[];

update public.productos
set imagenes_extra = '{}'::text[]
where imagenes_extra is null;

alter table public.productos
  alter column imagenes_extra set default '{}'::text[];

alter table public.productos
  alter column imagenes_extra set not null;
