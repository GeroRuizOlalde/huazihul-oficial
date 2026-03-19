"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  ClipboardList,
  Phone,
  Calendar,
  User,
  Check,
  Trash2,
  Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Inscripcion {
  id: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  deporte: "rugby" | "hockey" | "ambos" | "ninguno";
  tutor_nombre: string | null;
  telefono_contacto: string;
  estado: string;
  created_at: string;
}

type Filtro = "Todos" | "rugby" | "hockey" | "pendiente" | "contactado";

export default function AdminInscripcionesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("inscripciones_prueba")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) setErrorMsg("No pudimos cargar las inscripciones.");
      else setInscripciones(data || []);
      setIsLoading(false);
    };
    fetch();
  }, [supabase]);

  const cambiarEstado = async (id: string, estado: string) => {
    setActionId(id);
    const { error } = await supabase
      .from("inscripciones_prueba")
      .update({ estado })
      .eq("id", id);

    if (!error) {
      setInscripciones((prev) =>
        prev.map((i) => (i.id === id ? { ...i, estado } : i))
      );
    }
    setActionId(null);
  };

  const eliminar = async (id: string) => {
    if (!window.confirm("¿Eliminar esta inscripción?")) return;
    setActionId(id);
    const { error } = await supabase
      .from("inscripciones_prueba")
      .delete()
      .eq("id", id);

    if (!error) setInscripciones((prev) => prev.filter((i) => i.id !== id));
    setActionId(null);
  };

  const calcularEdad = (fechaNac: string) => {
    const hoy = new Date();
    const nac = new Date(fechaNac);
    const edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    return m < 0 || (m === 0 && hoy.getDate() < nac.getDate())
      ? edad - 1
      : edad;
  };

  const filtradas = inscripciones.filter((i) => {
    if (filtro === "Todos") return true;
    if (filtro === "rugby" || filtro === "hockey") return i.deporte === filtro;
    return i.estado === filtro;
  });

  const pendientes = inscripciones.filter((i) => i.estado === "pendiente").length;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-black uppercase tracking-tighter text-zinc-900">
            Clases de <span className="text-red-600">Prueba</span>
          </h1>
          <p className="text-sm font-light text-zinc-500">
            Solicitudes de inscripción desde las páginas de Rugby y Hockey.
          </p>
        </div>

        {pendientes > 0 && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-5 py-3">
            <ClipboardList className="h-4 w-4 text-red-600" />
            <span className="text-sm font-black uppercase tracking-widest text-red-600">
              {pendientes} pendiente{pendientes > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{errorMsg}</p>
        </div>
      )}

      {/* FILTROS */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-zinc-400" />
        {(["Todos", "rugby", "hockey", "pendiente", "contactado"] as Filtro[]).map((op) => (
          <button
            key={op}
            onClick={() => setFiltro(op)}
            className={`rounded-xl border px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              filtro === op
                ? "border-red-600 bg-red-600 text-white"
                : "border-zinc-100 bg-white text-zinc-400 hover:border-zinc-200"
            }`}
          >
            {op}
          </button>
        ))}
      </div>

      {/* LISTADO */}
      {filtradas.length > 0 ? (
        <div className="space-y-4">
          {filtradas.map((item) => {
            const edad = calcularEdad(item.fecha_nacimiento);
            const esMenor = edad < 18;

            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-2xl border bg-white p-6 transition-all hover:shadow-md ${
                  item.estado === "pendiente" ? "border-red-100" : "border-zinc-100"
                }`}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {/* INFO */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900">
                        {item.nombre_completo}
                      </h3>
                      <Badge
                        className={`rounded-none border-none text-[9px] uppercase tracking-widest ${
                          item.deporte === "rugby"
                            ? "bg-red-600 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {item.deporte}
                      </Badge>
                      <Badge
                        className={`rounded-none border text-[9px] uppercase tracking-widest ${
                          item.estado === "pendiente"
                            ? "border-orange-200 bg-orange-50 text-orange-600"
                            : "border-green-200 bg-green-50 text-green-700"
                        }`}
                      >
                        {item.estado}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-red-600" />
                        {edad} años
                        {esMenor && (
                          <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                            Menor
                          </span>
                        )}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-red-600" />
                        <a
                          href={`https://wa.me/54${item.telefono_contacto.replace(/\s/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-zinc-700 hover:text-green-600"
                        >
                          {item.telefono_contacto}
                        </a>
                      </span>

                      {item.tutor_nombre && (
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-red-600" />
                          Tutor:{" "}
                          <span className="font-bold text-zinc-700">
                            {item.tutor_nombre}
                          </span>
                        </span>
                      )}

                      <span className="text-zinc-400">
                        {new Date(item.created_at).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* ACCIONES */}
                  <div className="flex shrink-0 items-center gap-2">
                    {item.estado === "pendiente" ? (
                      <Button
                        onClick={() => cambiarEstado(item.id, "contactado")}
                        disabled={actionId === item.id}
                        className="rounded-xl bg-green-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-green-700"
                      >
                        {actionId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="mr-1.5 h-4 w-4" />
                            Marcar contactado
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => cambiarEstado(item.id, "pendiente")}
                        disabled={actionId === item.id}
                        variant="outline"
                        className="rounded-xl border-zinc-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500"
                      >
                        Reabrir
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => eliminar(item.id)}
                      disabled={actionId === item.id}
                      className="rounded-xl border-zinc-100 px-3 py-2 text-zinc-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 py-24 text-center">
          <ClipboardList className="mb-4 h-12 w-12 text-zinc-300" />
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            No hay inscripciones para este filtro
          </p>
        </div>
      )}
    </div>
  );
}