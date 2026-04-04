"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatPrecio,
  getProductoColores,
  getProductoImagenes,
  getProductoPrecio,
  getProductoPrecioPromocional,
  getProductoStock,
  getProductoStockTexto,
  getProductoTalleStock,
  getProductoTallesDisponibles,
  hasProductoPromocion,
  isProductoAgotado,
  isProductoDisponible,
  type Producto,
} from "@/lib/tienda";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  producto: Producto | null;
  whatsappNumber: string;
};

function buildWhatsAppLink(
  producto: Producto,
  whatsappNumber: string,
  options: {
    talle?: string;
    color?: string;
    cantidad?: number;
    restock?: boolean;
  }
) {
  const precioFinal =
    getProductoPrecioPromocional(producto) ?? getProductoPrecio(producto);
  const partes = [
    options.restock
      ? `Hola! Quiero saber cuando vuelve ${producto.nombre}.`
      : `Hola! Quiero comprar ${producto.nombre}.`,
    `Categoria: ${producto.categoria}.`,
    `Precio de referencia: $${formatPrecio(precioFinal)}.`,
  ];

  if (options.talle) {
    partes.push(`Talle: ${options.talle}.`);
  }

  if (options.color) {
    partes.push(`Color: ${options.color}.`);
  }

  if (options.cantidad) {
    partes.push(`Cantidad: ${options.cantidad}.`);
  }

  partes.push("Me pasan disponibilidad y forma de pago?");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(partes.join(" "))}`;
}

export function TiendaProductoModal({
  open,
  onOpenChange,
  producto,
  whatsappNumber,
}: Props) {
  const imagenes = useMemo(
    () => (producto ? getProductoImagenes(producto) : []),
    [producto]
  );
  const tallesDisponibles = useMemo(
    () => (producto ? getProductoTallesDisponibles(producto) : []),
    [producto]
  );
  const colores = useMemo(
    () => (producto ? getProductoColores(producto) : []),
    [producto]
  );

  const [imagenActiva, setImagenActiva] = useState(0);
  const [talleSeleccionado, setTalleSeleccionado] = useState(
    tallesDisponibles[0] ?? ""
  );
  const [colorSeleccionado, setColorSeleccionado] = useState(colores[0] ?? "");
  const [cantidad, setCantidad] = useState(1);

  if (!producto) {
    return null;
  }

  const stockMaximo = talleSeleccionado
    ? getProductoTalleStock(producto, talleSeleccionado)
    : Math.max(getProductoStock(producto) ?? 0, 0);
  const agotado = isProductoAgotado(producto);
  const whatsappLink = buildWhatsAppLink(producto, whatsappNumber, {
    talle: talleSeleccionado || undefined,
    color: colorSeleccionado || undefined,
    cantidad: isProductoDisponible(producto) ? cantidad : undefined,
    restock: agotado,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-none p-0 shadow-2xl sm:max-w-5xl">
        <DialogHeader className="border-b border-zinc-100 px-6 py-5 sm:px-8">
          <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-zinc-950">
            {producto.nombre}
          </DialogTitle>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            {producto.categoria}
          </p>
        </DialogHeader>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-zinc-50">
              {imagenes[imagenActiva] ? (
                <Image
                  src={imagenes[imagenActiva]}
                  alt={producto.nombre}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              ) : null}
            </div>

            {imagenes.length > 1 ? (
              <div className="flex flex-wrap gap-3">
                {imagenes.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setImagenActiva(index)}
                    className={cn(
                      "relative h-20 w-20 overflow-hidden rounded-2xl border-2 bg-zinc-50",
                      imagenActiva === index ? "border-red-600" : "border-transparent"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${producto.nombre} ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
                {getProductoStockTexto(producto)}
              </span>
              {hasProductoPromocion(producto) ? (
                <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  Oferta
                </span>
              ) : null}
              {agotado ? (
                <span className="rounded-full bg-zinc-950 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  Agotado
                </span>
              ) : null}
            </div>

            <div>
              {getProductoPrecioPromocional(producto) ? (
                <div className="flex items-end gap-3">
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-400 line-through">
                    ${formatPrecio(getProductoPrecio(producto))}
                  </span>
                  <span className="text-4xl font-black text-red-600">
                    ${formatPrecio(getProductoPrecioPromocional(producto) ?? 0)}
                  </span>
                </div>
              ) : (
                <p className="text-4xl font-black text-zinc-950">
                  ${formatPrecio(getProductoPrecio(producto))}
                </p>
              )}
            </div>

            <p className="text-sm leading-7 text-zinc-500">
              {producto.descripcion?.trim() ||
                "Prenda oficial de Huazihul. Selecciona talle y coordina la compra por WhatsApp."}
            </p>

            <div className="space-y-5 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Talle
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tallesDisponibles.length > 0 ? (
                    tallesDisponibles.map((talle) => (
                      <button
                        key={talle}
                        type="button"
                        onClick={() => {
                          setTalleSeleccionado(talle);
                          setCantidad(1);
                        }}
                        className={cn(
                          "rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] transition-colors",
                          talleSeleccionado === talle
                            ? "border-zinc-950 bg-zinc-950 text-white"
                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950"
                        )}
                      >
                        {talle}
                        <span className="ml-2 text-[10px] opacity-70">
                          {getProductoTalleStock(producto, talle)}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500">
                      Este producto no tiene talles disponibles ahora.
                    </p>
                  )}
                </div>
              </div>

              {colores.length > 0 ? (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    Color
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {colores.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setColorSeleccionado(color)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] transition-colors",
                          colorSeleccionado === color
                            ? "border-red-600 bg-red-600 text-white"
                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Cantidad
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="min-w-[5rem] rounded-full border border-zinc-200 bg-white px-5 py-3 text-center text-sm font-black tabular-nums text-zinc-950">
                    {cantidad}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setCantidad((prev) => Math.min(Math.max(stockMaximo, 1), prev + 1))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-semibold text-zinc-500">
                    {stockMaximo > 0 ? `${stockMaximo} disponibles` : "Consulta reposicion"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-black uppercase tracking-[0.18em]",
                  agotado ? "bg-zinc-950 text-white" : "bg-red-600 text-white"
                )}
              >
                {agotado ? "Consultar reposicion" : "Comprar por WhatsApp"}
                <MessageCircle className="h-4 w-4" />
              </a>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setImagenActiva((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))
                }
                className="h-12 rounded-full px-4"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setImagenActiva((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
                }
                className="h-12 rounded-full px-4"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
