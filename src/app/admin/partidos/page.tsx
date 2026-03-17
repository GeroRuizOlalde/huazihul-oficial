import Link from "next/link";
import { Plus, Trophy } from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public"; // <--- ESTO ES LO QUE FALTABA
import { PartidosList } from "./PartidosList";

export default async function AdminPartidosPage() {
  // Obtenemos la fecha y hora actual en formato ISO
  const ahora = new Date().toISOString();

  // Traemos los partidos:
  // 1. Los ordenamos por fecha_programada (el más cercano primero)
  // 2. Si querés que en el ADMIN se vean todos (viejos y nuevos), dejalo así.
  // 3. Si querés que el ADMIN solo muestre los que faltan jugar, descomentá la línea del .gte
  const { data: partidos, error } = await supabasePublic
    .from('partidos')
    .select('*')
    // .gte('fecha_programada', ahora) // Descomentá esto si querés ocultar los partidos pasados en el panel
    .order('fecha_programada', { ascending: true });

  if (error) {
    console.error("Error al traer partidos:", error);
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-1">
            Gestión de <span className="text-red-600">Partidos</span>
          </h1>
          <p className="text-sm font-light text-zinc-500">
            Módulo de fixture automatizado por cronología.
          </p>
        </div>
        
        <Link 
          href="/admin/partidos/nuevo" 
          className="inline-flex items-center justify-center bg-zinc-900 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-zinc-900/10"
        >
          <Plus className="w-4 h-4 mr-2" /> Cargar Partido
        </Link>
      </div>

      {/* LISTADO DE PARTIDOS */}
      <div className="grid grid-cols-1 gap-4">
        {partidos && partidos.length > 0 ? (
          <PartidosList initialPartidos={partidos} />
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-zinc-200 rounded-3xl">
            <Trophy className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">No hay partidos futuros programados</p>
            <p className="text-xs text-zinc-400 mt-1">Cargá el próximo encuentro para que aparezca en la web.</p>
          </div>
        )}
      </div>

    </div>
  );
}