"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Download, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface Foto {
  id: string;
  url: string;
  descripcion: string | null;
  etiqueta: string | null;
  nombre_socio: string | null;
}

interface Props {
  fotos: Foto[];
}

export function GaleriaGrid({ fotos }: Props) {
  const [indice, setIndice] = useState<number | null>(null);

  const abierto = indice !== null;
  const fotoActual = indice !== null ? fotos[indice] : null;

  const cerrar = useCallback(() => setIndice(null), []);

  const anterior = useCallback(() => {
    setIndice((i) => (i !== null ? (i === 0 ? fotos.length - 1 : i - 1) : null));
  }, [fotos.length]);

  const siguiente = useCallback(() => {
    setIndice((i) => (i !== null ? (i === fotos.length - 1 ? 0 : i + 1) : null));
  }, [fotos.length]);

  // Teclado: ESC cierra, flechas navegan
  useEffect(() => {
    if (!abierto) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") siguiente();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [abierto, cerrar, anterior, siguiente]);

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [abierto]);

  const handleDescargar = async () => {
    if (!fotoActual) return;
    try {
      const res = await fetch(fotoActual.url);
      const blob = await res.blob();
      const ext = fotoActual.url.split(".").pop()?.split("?")[0] || "jpg";
      const nombre = `huazihul-${fotoActual.id.slice(0, 8)}.${ext}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombre;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // fallback: abrir en nueva pestaña
      window.open(fotoActual.url, "_blank");
    }
  };

  return (
    <>
      {/* GRILLA */}
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-4 px-6 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
        {fotos.length > 0 ? (
          fotos.map((foto, i) => (
            <button
              key={foto.id}
              onClick={() => setIndice(i)}
              className="group relative aspect-square cursor-zoom-in overflow-hidden bg-zinc-100 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <img
                src={foto.url || "/images/fondo.jpg"}
                alt={foto.descripcion || "Foto de la galería de Huazihul"}
                className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
              />

              {/* Overlay hover */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {/* Ícono zoom */}
                <div className="absolute right-4 top-4 rounded-full bg-white/20 p-2 backdrop-blur-sm">
                  <ZoomIn className="h-4 w-4 text-white" />
                </div>

                <span className="mb-1 w-fit rounded-none bg-red-600 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                  {foto.etiqueta || "Mística"}
                </span>
                <p className="text-sm font-medium uppercase italic leading-tight tracking-tight text-white line-clamp-2">
                  {foto.descripcion || "Momento Huazihul"}
                </p>
                {foto.nombre_socio && (
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    📷 {foto.nombre_socio}
                  </p>
                )}
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full border-2 border-dashed border-zinc-200 py-20 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
              Todavía no hay fotos aprobadas.
            </p>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {abierto && fotoActual && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4"
          onClick={cerrar}
        >
          {/* Contador */}
          <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
            {(indice ?? 0) + 1} / {fotos.length}
          </div>

          {/* Botones top-right: descargar + cerrar */}
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleDescargar(); }}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-red-600"
              title="Descargar foto"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Descargar</span>
            </button>

            <button
              onClick={cerrar}
              className="rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              title="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Flecha izquierda */}
          {fotos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); anterior(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95 sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* IMAGEN PRINCIPAL */}
          <div
            className="relative flex max-h-[85vh] max-w-[90vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fotoActual.url}
              alt={fotoActual.descripcion || "Foto Huazihul"}
              className="max-h-[75vh] max-w-[85vw] rounded-lg object-contain shadow-2xl"
            />

            {/* Info debajo de la imagen */}
            {(fotoActual.descripcion || fotoActual.nombre_socio) && (
              <div className="mt-4 flex w-full flex-col items-center gap-1 text-center">
                {fotoActual.descripcion && (
                  <p className="text-sm font-medium italic text-white/80">
                    {fotoActual.descripcion}
                  </p>
                )}
                {fotoActual.nombre_socio && (
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                    📷 {fotoActual.nombre_socio}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Flecha derecha */}
          {fotos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); siguiente(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95 sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Dots navegación (máx 12 para no saturar) */}
          {fotos.length > 1 && fotos.length <= 12 && (
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
              {fotos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndice(i); }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === indice
                      ? "w-6 bg-red-600"
                      : "w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}