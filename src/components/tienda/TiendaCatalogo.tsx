"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import {
  ArrowRight,
  MessageCircle,
  Search,
  Shirt,
  Sparkles,
  Tag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  en_stock: boolean;
};

interface Props {
  productos: Producto[];
  whatsappNumber: string;
}

const formatPrice = new Intl.NumberFormat("es-AR");

function buildWhatsAppLink(producto: Producto, whatsappNumber: string) {
  const mensaje = `Hola! Quiero consultar por ${producto.nombre}.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
}

function getDescription(producto: Producto) {
  const descripcion = producto.descripcion?.trim();
  return descripcion || "Indumentaria oficial del club. Consultanos para conocer disponibilidad y coordinacion.";
}

export function TiendaCatalogo({ productos, whatsappNumber }: Props) {
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [productoActivo, setProductoActivo] = useState<Producto | null>(null);

  const busquedaDiferida = useDeferredValue(busqueda);

  const categorias = useMemo(() => {
    const activas = Array.from(new Set(productos.map((producto) => producto.categoria))).sort();
    return ["Todos", ...activas];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const termino = busquedaDiferida.trim().toLowerCase();

    return productos.filter((producto) => {
      const coincideCategoria = filtro === "Todos" || producto.categoria === filtro;
      const coincideBusqueda =
        termino.length === 0 ||
        producto.nombre.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino) ||
        producto.descripcion?.toLowerCase().includes(termino);

      return coincideCategoria && coincideBusqueda;
    });
  }, [busquedaDiferida, filtro, productos]);

  return (
    <section id="catalogo" className="bg-zinc-50 px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-600">
                Catalogo en linea
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase italic tracking-tighter text-zinc-950 md:text-5xl">
                Elegi rapido. Consulta mejor.
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-zinc-500 md:text-base">
                Filtra, busca y abre cada prenda en vista rapida. La experiencia esta
                pensada para mobile primero y con conversion clara en cada tarjeta.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-red-600">
                {productosFiltrados.length} resultados
              </Badge>
              <Badge className="rounded-full border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-600">
                Stock visible
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por nombre, categoria o descripcion"
                className="h-12 rounded-full border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm focus:ring-red-600"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => setFiltro(categoria)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] transition-all",
                    filtro === categoria
                      ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
                  )}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        </div>

        {productosFiltrados.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {productosFiltrados.map((producto) => (
              <article
                key={producto.id}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-200/70"
              >
                <button
                  onClick={() => setProductoActivo(producto)}
                  className="relative block aspect-[4/5] overflow-hidden bg-zinc-100 text-left"
                >
                  <Image
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <Badge className="rounded-full border-none bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-900">
                      {producto.categoria}
                    </Badge>
                    <Badge className="rounded-full border-none bg-red-600/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white">
                      Disponible
                    </Badge>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-5">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-red-400">
                      Coleccion oficial
                    </p>
                    <h3 className="max-w-[80%] text-2xl font-black uppercase italic leading-none tracking-tighter text-white">
                      {producto.nombre}
                    </h3>
                  </div>
                </button>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">
                        Precio
                      </p>
                      <p className="mt-1 text-3xl font-black tracking-tighter text-zinc-950">
                        ${formatPrice.format(producto.precio)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-50 p-3">
                      <Tag className="h-5 w-5 text-red-600" />
                    </div>
                  </div>

                  <p className="line-clamp-3 text-sm font-light leading-relaxed text-zinc-600">
                    {getDescription(producto)}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">
                    <Sparkles className="h-4 w-4 text-red-600" />
                    Consulta directa con el club
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={buildWhatsAppLink(producto, whatsappNumber)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-zinc-950 px-5 text-[10px] font-black uppercase tracking-[0.24em] text-white transition-colors hover:bg-red-600"
                    >
                      Consultar
                      <MessageCircle className="ml-2 h-4 w-4" />
                    </a>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setProductoActivo(producto)}
                      className="h-12 rounded-full border-zinc-200 px-5 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      Ver mas
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] border-2 border-dashed border-zinc-200 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50">
              <Shirt className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="mt-6 text-2xl font-black uppercase italic tracking-tighter text-zinc-950">
              No encontramos prendas con esos filtros.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm font-light leading-relaxed text-zinc-500">
              Prueba con otra categoria o una busqueda mas amplia. Si tienes algo
              puntual en mente, escribenos directo y te ayudamos.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                "Hola! No encontre la prenda que buscaba en la boutique de Huazihul."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-red-600 px-6 text-[10px] font-black uppercase tracking-[0.24em] text-white transition-colors hover:bg-zinc-950"
            >
              Pedir ayuda
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        )}
      </div>

      <Dialog open={Boolean(productoActivo)} onOpenChange={(open) => !open && setProductoActivo(null)}>
        {productoActivo && (
          <DialogContent className="overflow-hidden border-none p-0 shadow-2xl sm:max-w-4xl">
            <div className="grid md:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[360px] bg-zinc-100">
                <Image
                  src={productoActivo.imagen_url}
                  alt={productoActivo.nombre}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              <div className="flex flex-col p-8 md:p-10">
                <DialogHeader className="text-left">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge className="rounded-full border-red-200 bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-red-600">
                      {productoActivo.categoria}
                    </Badge>
                    <Badge className="rounded-full border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-600">
                      Stock visible
                    </Badge>
                  </div>
                  <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-zinc-950 md:text-4xl">
                    {productoActivo.nombre}
                  </DialogTitle>
                </DialogHeader>

                <p className="mt-5 text-4xl font-black tracking-tighter text-zinc-950">
                  ${formatPrice.format(productoActivo.precio)}
                </p>

                <p className="mt-6 text-sm font-light leading-relaxed text-zinc-600 md:text-base">
                  {getDescription(productoActivo)}
                </p>

                <div className="mt-8 grid gap-3 rounded-[1.5rem] bg-zinc-50 p-5">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="mt-0.5 h-4 w-4 text-red-600" />
                    <p className="text-sm text-zinc-600">
                      Atencion directa por WhatsApp para confirmar disponibilidad.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shirt className="mt-0.5 h-4 w-4 text-red-600" />
                    <p className="text-sm text-zinc-600">
                      Si necesitas talles o un pedido especial, lo coordinamos por el mismo canal.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={buildWhatsAppLink(productoActivo, whatsappNumber)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-red-600 px-5 text-[10px] font-black uppercase tracking-[0.24em] text-white transition-colors hover:bg-zinc-950"
                  >
                    Consultar esta prenda
                    <MessageCircle className="ml-2 h-4 w-4" />
                  </a>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setProductoActivo(null)}
                    className="h-12 rounded-full border-zinc-200 px-5 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
                  >
                    Seguir viendo
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
