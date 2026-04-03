import Link from "next/link";
import { Plus, Trophy } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import { PartidosList } from "./PartidosList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPartidosPage() {
  const supabase = await createClient();

  const { data: partidos, error } = await supabase
    .from("partidos")
    .select(
      "id, fecha_programada, equipo_local, equipo_visitante, resultado_local, resultado_visitante, cancha, deporte"
    )
    .order("fecha_programada", { ascending: true });

  if (error) {
    console.error("Error al traer partidos:", error);
  }

  const listaPartidos = partidos ?? [];

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-black uppercase tracking-tighter text-zinc-900">
            Gestion de <span className="text-red-600">Partidos</span>
          </h1>
          <p className="text-sm font-light text-zinc-500">
            Modulo de fixture automatizado por cronologia.
          </p>
        </div>

        <Link
          href="/admin/partidos/nuevo"
          className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-red-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Cargar Partido
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {listaPartidos.length > 0 ? (
          <PartidosList initialPartidos={listaPartidos} />
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-zinc-200 py-20 text-center">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
              No hay partidos cargados
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Carga un encuentro para que aparezca en la gestion.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
