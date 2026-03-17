"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, X, Loader2, Image as ImageIcon, Clock } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Foto {
  id: number;
  url: string;
  descripcion: string | null;
  etiqueta: string | null;
  creado_en: string;
}

export default function ModeracionGaleriaPage() {
  const supabase = useMemo(() => createClient(), []);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPendientes = async () => {
      setIsLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("galeria")
        .select("id, url, descripcion, etiqueta, creado_en")
        .eq("aprobado", false)
        .order("creado_en", { ascending: true });

      if (error) {
        setErrorMsg("No pudimos cargar las fotos pendientes.");
        setFotos([]);
      } else {
        setFotos(data || []);
      }

      setIsLoading(false);
    };

    fetchPendientes();
  }, [supabase]);

  const handleAprobar = async (id: number) => {
    setActionId(id);
    setErrorMsg("");

    const { error } = await supabase
      .from("galeria")
      .update({ aprobado: true })
      .eq("id", id);

    if (error) {
      setErrorMsg("No pudimos aprobar la foto. Intentá nuevamente.");
    } else {
      setFotos((prev) => prev.filter((f) => f.id !== id));
    }

    setActionId(null);
  };

  const handleRechazar = async (id: number) => {
    if (!window.confirm("¿Rechazar esta foto? Se eliminará permanentemente.")) {
      return;
    }

    setActionId(id);
    setErrorMsg("");

    const { error } = await supabase.from("galeria").delete().eq("id", id);

    if (error) {
      setErrorMsg("No pudimos rechazar la foto. Intentá nuevamente.");
    } else {
      setFotos((prev) => prev.filter((f) => f.id !== id));
    }

    setActionId(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-black uppercase tracking-tighter text-zinc-900 md:text-4xl">
          Moderación de <span className="text-red-600">Galería</span>
        </h1>
        <p className="text-sm font-light text-zinc-500">
          Revisá y aprobá las fotos enviadas por la comunidad.
        </p>
      </header>

      {errorMsg && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{errorMsg}</p>
        </div>
      )}

      {fotos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fotos.map((foto) => (
            <div
              key={foto.id}
              className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* FOTO */}
              <div className="relative aspect-square overflow-hidden bg-zinc-100">
                <img
                  src={foto.url}
                  alt={foto.descripcion || "Foto enviada a la galería"}
                  className="h-full w-full object-cover"
                />

                <div className="absolute left-4 top-4">
                  <Badge className="rounded-none border-none bg-zinc-900/80 px-3 py-1 text-[9px] uppercase tracking-widest text-white backdrop-blur-sm">
                    {foto.etiqueta || "Mística"}
                  </Badge>
                </div>
              </div>

              {/* INFO */}
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <Clock className="h-3 w-3" />
                  {new Date(foto.creado_en).toLocaleDateString("es-AR")}
                </div>

                <p className="mb-6 line-clamp-2 text-sm font-medium italic leading-tight text-zinc-700">
                  “{foto.descripcion || "Sin descripción"}”
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleAprobar(foto.id)}
                    disabled={actionId === foto.id}
                    className="rounded-xl bg-green-600 py-5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-green-700"
                  >
                    {actionId === foto.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Aprobar
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleRechazar(foto.id)}
                    disabled={actionId === foto.id}
                    variant="outline"
                    className="rounded-xl border-zinc-200 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Rechazar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50">
            <ImageIcon className="h-8 w-8 text-zinc-300" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            No hay fotos pendientes de revisión
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Todo el contenido de la comunidad está al día.
          </p>
        </div>
      )}
    </div>
  );
}