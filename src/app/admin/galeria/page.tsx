"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  X,
  Loader2,
  Image as ImageIcon,
  Clock,
  RotateCcw,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Foto {
  id: string;
  url: string;
  descripcion: string | null;
  etiqueta: string | null;
  aprobado: boolean;
  nombre_socio: string | null;
  creado_en: string;
}

type Tab = "publicadas" | "pendientes";

export default function ModeracionGaleriaPage() {
  const supabase = useMemo(() => createClient(), []);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [tab, setTab] = useState<Tab>("pendientes");

  useEffect(() => {
    const fetchTodas = async () => {
      setIsLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("galeria")
        .select("id, url, descripcion, etiqueta, aprobado, nombre_socio, creado_en")
        .order("creado_en", { ascending: false });

      if (error) {
        setErrorMsg("No pudimos cargar las fotos.");
        setFotos([]);
      } else {
        setFotos(data || []);
      }

      setIsLoading(false);
    };

    fetchTodas();
  }, [supabase]);

  const publicadas = fotos.filter((f) => f.aprobado);
  const pendientes = fotos.filter((f) => !f.aprobado);
  const listaActual = tab === "publicadas" ? publicadas : pendientes;

  // Aprobar una foto pendiente
  const handleAprobar = async (id: string) => {
    setActionId(id);
    setErrorMsg("");
    const { error } = await supabase
      .from("galeria")
      .update({ aprobado: true })
      .eq("id", id);

    if (error) {
      setErrorMsg("No pudimos aprobar la foto.");
    } else {
      setFotos((prev) =>
        prev.map((f) => (f.id === id ? { ...f, aprobado: true } : f))
      );
    }
    setActionId(null);
  };

  // Revertir una foto aprobada a pendiente
  const handleRevertir = async (id: string) => {
    setActionId(id);
    setErrorMsg("");
    const { error } = await supabase
      .from("galeria")
      .update({ aprobado: false })
      .eq("id", id);

    if (error) {
      setErrorMsg("No pudimos revertir la foto.");
    } else {
      setFotos((prev) =>
        prev.map((f) => (f.id === id ? { ...f, aprobado: false } : f))
      );
    }
    setActionId(null);
  };

  // Eliminar permanentemente
  const handleEliminar = async (id: string) => {
    if (!window.confirm("¿Eliminar esta foto permanentemente? No se puede deshacer.")) return;

    setActionId(id);
    setErrorMsg("");
    const { error } = await supabase.from("galeria").delete().eq("id", id);

    if (error) {
      setErrorMsg("No pudimos eliminar la foto.");
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
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="mb-1 text-3xl font-black uppercase tracking-tighter text-zinc-900 md:text-4xl">
          Gestión de <span className="text-red-600">Galería</span>
        </h1>
        <p className="text-sm font-light text-zinc-500">
          Moderá las fotos enviadas por la comunidad y gestioná las publicadas.
        </p>
      </header>

      {errorMsg && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{errorMsg}</p>
        </div>
      )}

      {/* TABS */}
      <div className="mb-8 flex gap-2 border-b border-zinc-200">
        <button
          onClick={() => setTab("pendientes")}
          className={`flex items-center gap-2 border-b-2 px-5 pb-3 text-xs font-black uppercase tracking-widest transition-all ${
            tab === "pendientes"
              ? "border-red-600 text-red-600"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Pendientes
          {pendientes.length > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[9px] font-black text-white">
              {pendientes.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab("publicadas")}
          className={`flex items-center gap-2 border-b-2 px-5 pb-3 text-xs font-black uppercase tracking-widest transition-all ${
            tab === "publicadas"
              ? "border-red-600 text-red-600"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          Publicadas
          <span className="text-[10px] font-medium normal-case tracking-normal text-zinc-400">
            ({publicadas.length})
          </span>
        </button>
      </div>

      {/* GRILLA */}
      {listaActual.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listaActual.map((foto) => (
            <div
              key={foto.id}
              className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* IMAGEN */}
              <div className="relative aspect-square overflow-hidden bg-zinc-100">
                <img
                  src={foto.url}
                  alt={foto.descripcion || "Foto de la galería"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badge estado */}
                <div className="absolute left-4 top-4">
                  {foto.aprobado ? (
                    <Badge className="flex items-center gap-1 rounded-none border-none bg-green-600/90 px-3 py-1 text-[9px] uppercase tracking-widest text-white backdrop-blur-sm">
                      <Eye className="h-3 w-3" />
                      Publicada
                    </Badge>
                  ) : (
                    <Badge className="flex items-center gap-1 rounded-none border-none bg-orange-500/90 px-3 py-1 text-[9px] uppercase tracking-widest text-white backdrop-blur-sm">
                      <Clock className="h-3 w-3" />
                      Pendiente
                    </Badge>
                  )}
                </div>

                {/* Etiqueta */}
                {foto.etiqueta && (
                  <div className="absolute right-4 top-4">
                    <Badge className="rounded-none border-none bg-zinc-900/80 px-3 py-1 text-[9px] uppercase tracking-widest text-white backdrop-blur-sm">
                      {foto.etiqueta}
                    </Badge>
                  </div>
                )}
              </div>

              {/* INFO + ACCIONES */}
              <div className="p-5">
                <div className="mb-4">
                  <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <Clock className="h-3 w-3" />
                    {new Date(foto.creado_en).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <p className="line-clamp-2 text-sm font-medium italic leading-tight text-zinc-700">
                    "{foto.descripcion || "Sin descripción"}"
                  </p>
                  {foto.nombre_socio && (
                    <p className="mt-1 text-[10px] text-zinc-400">
                      Por: <span className="font-bold">{foto.nombre_socio}</span>
                    </p>
                  )}
                </div>

                {/* ACCIONES según estado */}
                {foto.aprobado ? (
                  // Foto publicada: revertir o eliminar
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleRevertir(foto.id)}
                      disabled={actionId === foto.id}
                      variant="outline"
                      className="rounded-xl border-orange-200 py-5 text-[10px] font-bold uppercase tracking-widest text-orange-600 hover:bg-orange-50"
                    >
                      {actionId === foto.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <EyeOff className="mr-1.5 h-4 w-4" />
                          Despublicar
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => handleEliminar(foto.id)}
                      disabled={actionId === foto.id}
                      variant="outline"
                      className="rounded-xl border-zinc-200 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      {actionId === foto.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="mr-1.5 h-4 w-4" />
                          Eliminar
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  // Foto pendiente: aprobar o rechazar
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
                          <Check className="mr-1.5 h-4 w-4" />
                          Aprobar
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => handleEliminar(foto.id)}
                      disabled={actionId === foto.id}
                      variant="outline"
                      className="rounded-xl border-zinc-200 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      {actionId === foto.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <X className="mr-1.5 h-4 w-4" />
                          Rechazar
                        </>
                      )}
                    </Button>
                  </div>
                )}
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
            {tab === "pendientes"
              ? "No hay fotos pendientes de revisión"
              : "No hay fotos publicadas todavía"}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {tab === "pendientes"
              ? "Todo el contenido de la comunidad está al día."
              : "Aprobá fotos desde la pestaña Pendientes."}
          </p>
        </div>
      )}
    </div>
  );
}