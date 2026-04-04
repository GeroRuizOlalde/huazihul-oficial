"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, MessageCircle, ShoppingBag, Tag } from "lucide-react";

import {
  getProductoColores,
  formatPrecio,
  getProductoImagenes,
  getProductoPrecio,
  getProductoPrecioPromocional,
  getProductoStock,
  getProductoStockTexto,
  getProductoTalles,
  getProductoTallesDisponibles,
  hasProductoPromocion,
  isProductoAgotado,
  isProductoBajoStock,
  sortTalles,
  type Producto,
} from "@/lib/tienda";
import { cn } from "@/lib/utils";
import { TiendaProductoModal } from "@/components/tienda/TiendaProductoModal";

interface Props {
  productos: Producto[];
  whatsappNumber: string;
}

type OrdenCatalogo = "relevancia" | "precio-asc" | "precio-desc" | "nombre";

export function TiendaCatalogo({ productos, whatsappNumber }: Props) {
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroTalle, setFiltroTalle] = useState("Todos");
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [orden, setOrden] = useState<OrdenCatalogo>("relevancia");
  const [productoActivo, setProductoActivo] = useState<Producto | null>(null);

  const categorias = useMemo(() => {
    const activas = Array.from(
      new Set(productos.map((producto) => producto.categoria).filter(Boolean))
    ).sort();

    return ["Todos", ...activas];
  }, [productos]);

  const talles = useMemo(() => {
    const disponibles = sortTalles(
      Array.from(
        new Set(productos.flatMap((producto) => getProductoTalles(producto)))
      )
    );

    return ["Todos", ...disponibles];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const filtered = productos.filter((producto) => {
      const coincideCategoria =
        filtroCategoria === "Todos" || producto.categoria === filtroCategoria;
      const coincideTalle =
        filtroTalle === "Todos" || getProductoTalles(producto).includes(filtroTalle);
      const coincideOferta = !soloOfertas || hasProductoPromocion(producto);

      return coincideCategoria && coincideTalle && coincideOferta;
    });

    return [...filtered].sort((a, b) => {
      if (orden === "precio-asc") {
        const precioA = getProductoPrecioPromocional(a) ?? getProductoPrecio(a);
        const precioB = getProductoPrecioPromocional(b) ?? getProductoPrecio(b);
        return precioA - precioB;
      }

      if (orden === "precio-desc") {
        const precioA = getProductoPrecioPromocional(a) ?? getProductoPrecio(a);
        const precioB = getProductoPrecioPromocional(b) ?? getProductoPrecio(b);
        return precioB - precioA;
      }

      if (orden === "nombre") {
        return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
      }

      const score = (producto: Producto) =>
        (isProductoAgotado(producto) ? 0 : 50) +
        (hasProductoPromocion(producto) ? 30 : 0) +
        (isProductoBajoStock(producto) ? 10 : 0) +
        (getProductoStock(producto) ?? 0);

      return score(b) - score(a);
    });
  }, [filtroCategoria, filtroTalle, orden, productos, soloOfertas]);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <div className="border-b border-zinc-100 px-6 pb-12 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-600">
                Boutique oficial
              </p>
              <h1 className="text-6xl font-black uppercase italic leading-none tracking-tighter md:text-8xl">
                Boutique<span className="text-red-600">.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-xs font-medium uppercase tracking-[0.16em] text-zinc-500 md:text-sm">
                Indumentaria oficial del club. Stock real, promociones y atencion
                directa por WhatsApp.
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-8 gap-y-4">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => setFiltroCategoria(categoria)}
                  className={cn(
                    "relative pb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                    filtroCategoria === categoria
                      ? "text-red-600"
                      : "text-zinc-400 hover:text-zinc-900"
                  )}
                >
                  {categoria}
                  {filtroCategoria === categoria ? (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-red-600" />
                  ) : null}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8 border-t border-zinc-100 pt-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-5">
                <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Filtrar por talle
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {talles.map((talle) => (
                    <button
                      key={talle}
                      type="button"
                      onClick={() => setFiltroTalle(talle)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] transition-colors",
                        filtroTalle === talle
                          ? "border-zinc-950 bg-zinc-950 text-white"
                          : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-900 hover:text-zinc-950"
                      )}
                    >
                      {talle}
                    </button>
                  ))}
                </div>
              </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSoloOfertas((prev) => !prev)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors",
                      soloOfertas
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-950 hover:text-zinc-950"
                    )}
                  >
                    Solo promociones
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                  Ordenar
                  <select
                    value={orden}
                    onChange={(event) =>
                      setOrden(event.target.value as OrdenCatalogo)
                    }
                    className="h-11 rounded-full border border-zinc-200 bg-white px-4 text-[11px] font-black uppercase tracking-[0.14em] text-zinc-700 outline-none"
                  >
                    <option value="relevancia">Relevancia</option>
                    <option value="precio-asc">Precio menor</option>
                    <option value="precio-desc">Precio mayor</option>
                    <option value="nombre">Nombre</option>
                  </select>
                </label>

                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  {productosFiltrados.length} producto
                  {productosFiltrados.length === 1 ? "" : "s"} visible
                  {productosFiltrados.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {productosFiltrados.map((producto) => {
              const precio = getProductoPrecio(producto);
              const precioPromocional = getProductoPrecioPromocional(producto);
              const tallesDisponibles = getProductoTallesDisponibles(producto);
              const colores = getProductoColores(producto);
              const imagenes = getProductoImagenes(producto);
              const agotado = isProductoAgotado(producto);
              const bajoStock = isProductoBajoStock(producto);

              return (
                <article key={producto.id} className="group">
                  <button
                    type="button"
                    onClick={() => setProductoActivo(producto)}
                    className="block w-full text-left"
                  >
                    <div className="relative mb-6 aspect-[3/4] overflow-hidden bg-zinc-50">
                      <Image
                        src={imagenes[0] ?? producto.imagen_url}
                        alt={producto.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 shadow-sm">
                          {getProductoStockTexto(producto)}
                        </span>
                        {precioPromocional ? (
                          <span className="bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-sm">
                            Oferta
                          </span>
                        ) : null}
                        {agotado ? (
                          <span className="bg-zinc-950 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-sm">
                            Agotado
                          </span>
                        ) : bajoStock ? (
                          <span className="bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-950 shadow-sm">
                            Ultimas
                          </span>
                        ) : null}
                      </div>

                      <div className="absolute inset-0 flex items-end bg-black/5 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="flex w-full items-center justify-center gap-2 bg-white py-4 text-[10px] font-black uppercase tracking-widest text-zinc-900 shadow-2xl">
                          Ver detalles
                        </span>
                      </div>
                    </div>
                  </button>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-black uppercase italic leading-tight tracking-tighter transition-colors group-hover:text-red-600">
                        {producto.nombre}
                      </h3>

                      <div className="text-right">
                        {precioPromocional ? (
                          <>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400 line-through">
                              ${formatPrecio(precio)}
                            </p>
                            <p className="text-lg font-bold text-red-600 tabular-nums">
                              ${formatPrecio(precioPromocional)}
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-zinc-900 tabular-nums">
                            ${formatPrecio(precio)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        {producto.categoria}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {producto.descripcion?.trim() || "Consulta directa con el club."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {tallesDisponibles.length > 0 ? (
                        <>
                          {tallesDisponibles.slice(0, 5).map((talle) => (
                            <span
                              key={talle}
                              className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-700"
                            >
                              {talle}
                            </span>
                          ))}
                          {tallesDisponibles.length > 5 ? (
                            <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
                              +{tallesDisponibles.length - 5}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-[11px] text-zinc-400">
                          Consultar talles disponibles
                        </span>
                      )}
                    </div>

                    {colores.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {colores.slice(0, 4).map((color) => (
                          <span
                            key={color}
                            className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-zinc-100 bg-zinc-50 px-6 py-20 text-center">
            <Tag className="mx-auto h-10 w-10 text-red-600" />
            <h2 className="mt-6 text-2xl font-black uppercase italic tracking-tighter text-zinc-950">
              No hay productos visibles para este filtro.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-zinc-500">
              Prueba con otra categoria o talle. Si necesitas una prenda puntual
              o un pedido para equipo, escribenos y lo resolvemos por WhatsApp.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                "Hola! Quiero consultar por la boutique oficial de Huazihul."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 transition-colors hover:text-red-600"
            >
              Hablar con el club
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          <ShoppingBag className="mb-6 h-12 w-12 text-zinc-200" />
          <h2 className="mb-4 text-2xl font-black uppercase italic tracking-tighter">
            No encontras lo que buscas?
          </h2>
          <p className="mb-8 max-w-md text-sm font-medium text-zinc-500">
            Si necesitas talles especiales o pedidos para equipos completos,
            ponte en contacto con la secretaria del club.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Hola! Necesito ayuda con una compra de la boutique de Huazihul."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] transition-colors hover:text-red-600"
          >
            Atencion al socio
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <TiendaProductoModal
        key={productoActivo?.id ?? "sin-producto"}
        open={Boolean(productoActivo)}
        onOpenChange={(open) => {
          if (!open) {
            setProductoActivo(null);
          }
        }}
        producto={productoActivo}
        whatsappNumber={whatsappNumber}
      />
    </div>
  );
}
