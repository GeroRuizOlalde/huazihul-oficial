alter table public.productos
  add column if not exists variantes jsonb;

update public.productos
set variantes = '[]'::jsonb
where variantes is null;

alter table public.productos
  alter column variantes set default '[]'::jsonb;

alter table public.productos
  alter column variantes set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'productos_variantes_array'
  ) then
    alter table public.productos
      add constraint productos_variantes_array
      check (jsonb_typeof(variantes) = 'array');
  end if;
end $$;
