alter table public.productos
  add column if not exists stock integer;

alter table public.productos
  add column if not exists precio_promocional numeric;

update public.productos
set stock = case
  when coalesce(en_stock, false) then 1
  else 0
end
where stock is null;

alter table public.productos
  alter column stock set default 0;

alter table public.productos
  alter column stock set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'productos_stock_nonnegative'
  ) then
    alter table public.productos
      add constraint productos_stock_nonnegative
      check (stock >= 0);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'productos_precio_promocional_valido'
  ) then
    alter table public.productos
      add constraint productos_precio_promocional_valido
      check (
        precio_promocional is null
        or (precio_promocional > 0 and precio_promocional < precio)
      );
  end if;
end $$;

update public.productos
set en_stock = stock > 0;
