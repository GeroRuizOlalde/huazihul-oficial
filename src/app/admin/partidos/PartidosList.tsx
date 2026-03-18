"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Trophy, Pencil, Trash2, Loader2, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Filtro = "Todos" | "Rugby" | "Hockey";

interface Partido {
  id: number;
  deporte: "Rugby" | "Hockey" | string;
  fecha_programada: string;
  equipo_local: string;
  equipo_visitante: string;
  resultado_local: number | null;
  resultado_visitante: number | null;
  cancha?: string | null;
}

export function PartidosList({
  initialPartidos,
}: {
  initialPartidos: Partido[];
}) {
  const [partidos, setPartidos] = useState<Partido[]>(initialPartidos);
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const partidosMostrados =
    filtro === "Todos"
      ? partidos
      : partidos.filter((p) => p.deporte === filtro);

  const handleDelete = async (id: number, local: string, visita: string) => {
    const confirmar = window.confirm(
      `¿Estás seguro de borrar el partido ${local} vs ${visita}?`
    );
    if (!confirmar) return;

    setIsDeleting(id);
    setErrorMsg("");

    const { error } = await supabase.from("partidos").delete().eq("id", id);

    if (error) {
      setErrorMsg(`Error al borrar el partido: ${error.message}`);
    } else {
      setPartidos((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    }

    setIsDeleting(null);
  };

  return (
    <div className="space-y-8">
      {/* FILTRO */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-2 sm:flex-row">
        <div className="flex items-center gap-2 px-4 py-2 text-zinc-400">
          <Filter className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Filtrar por:
          </span>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          {(["Todos", "Rugby", "Hockey"] as Filtro[]).map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => setFiltro(opcion)}
              className={`flex-1 rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all sm:flex-none ${
                filtro === opcion
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                  : "border border-zinc-100 bg-white text-zinc-400 hover:border-zinc-200"
              }`}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{errorMsg}</p>
        </div>
      )}

      {/* LISTADO */}
      <div className="grid grid-cols-1 gap-4">
        {partidosMostrados.length > 0 ? (
          partidosMostrados.map((partido) => {
            const fechaObj = new Date(partido.fecha_programada);
            const diaVisual = fechaObj.toLocaleDateString("es-AR", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
            });
            const horaVisual = fechaObj.toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            const huazihulEsLocal = (partido.equipo_local ?? "")
            .toUpperCase()
            .includes("HUAZIHUL");

            return (
              <div
                key={partido.id}
                className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 transition-all hover:border-red-100 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                  {/* FECHA Y DISCIPLINA */}
                  <div className="flex min-w-[120px] flex-col">
                    <span className="mb-1 text-[10px] font-black uppercase tracking-widest text-red-600">
                      {diaVisual} · {horaVisual} HS
                    </span>

                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          partido.deporte === "Rugby"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      />
                      <span className="text-[10px] font-bold uppercase text-zinc-400">
                        {partido.deporte}
                      </span>
                    </div>
                  </div>

                  {/* EQUIPOS Y MARCADOR */}
                  <div className="flex flex-1 items-center gap-6">
                    <div className="flex-1 text-right">
                      <span
                        className={`text-lg font-black uppercase tracking-tighter ${
                          huazihulEsLocal ? "text-zinc-900" : "text-zinc-400"
                        }`}
                      >
                        {partido.equipo_local ?? "Local"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-2 transition-colors group-hover:bg-zinc-100">
                      <span className="text-2xl font-black text-zinc-900">
                        {partido.resultado_local ?? "-"}
                      </span>
                      <span className="text-xs font-bold italic text-zinc-300">
                        VS
                      </span>
                      <span className="text-2xl font-black text-zinc-900">
                        {partido.resultado_visitante ?? "-"}
                      </span>
                    </div>

                    <div className="flex-1 text-left">
                      <span
                        className={`text-lg font-black uppercase tracking-tighter ${
                          !huazihulEsLocal ? "text-zinc-900" : "text-zinc-400"
                        }`}
                      >
                        {partido.equipo_visitante ?? "Visitante"}
                      </span>
                    </div>
                  </div>

                  {/* ACCIONES */}
                  <div className="flex items-center gap-2 border-zinc-100 pt-4 lg:border-l lg:pl-6 lg:pt-0">
                    <Link
                      href={`/admin/partidos/editar/${partido.id}`}
                      className="rounded-xl p-3 text-zinc-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-5 w-5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          partido.id,
                          partido.equipo_local,
                          partido.equipo_visitante
                        )
                      }
                      disabled={isDeleting === partido.id}
                      className="rounded-xl p-3 text-zinc-400 transition-all hover:bg-red-50 hover:text-red-600"
                    >
                      {isDeleting === partido.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[2.5rem] border-2 border-dashed border-zinc-100 bg-zinc-50/50 py-20 text-center">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-zinc-200" />
            <p className="text-sm font-black uppercase tracking-widest text-zinc-400">
              No hay partidos para {filtro}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}