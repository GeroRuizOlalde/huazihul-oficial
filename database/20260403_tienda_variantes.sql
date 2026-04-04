alter table public.productos
  add column if not exists variantes jsonb;

alter table public.productos
  alter column variantes set default '[]'::jsonb;

with talles_expand as (
  select
    p.id,
    upper(trim(t.talle)) as talle,
    t.ord,
    cardinality(coalesce(p.talles, '{}'::text[])) as total_talles,
    greatest(coalesce(p.stock, 0), 0) as total_stock
  from public.productos p
  cross join lateral unnest(coalesce(p.talles, '{}'::text[])) with ordinality as t(talle, ord)
  where nullif(trim(t.talle), '') is not null
),
variantes_calculadas as (
  select
    id,
    jsonb_agg(
      jsonb_build_object(
        'talle',
        talle,
        'stock',
        case
          when total_stock <= 0 then 0
          else floor(total_stock::numeric / total_talles)::int
            + case when ord <= mod(total_stock, total_talles) then 1 else 0 end
        end
      )
      order by ord
    ) as variantes
  from talles_expand
  group by id, total_talles, total_stock
)
update public.productos p
set variantes = coalesce(datos.variantes, '[]'::jsonb)
from (
  select p2.id, vc.variantes
  from public.productos p2
  left join variantes_calculadas vc on vc.id = p2.id
) as datos
where p.id = datos.id
  and (
    p.variantes is null
    or p.variantes = '[]'::jsonb
  );

update public.productos
set variantes = '[]'::jsonb
where variantes is null;

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
