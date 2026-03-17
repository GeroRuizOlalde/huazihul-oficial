"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, MapPin, Calendar, Pencil, Trash2, Loader2, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function PartidosList({ initialPartidos }: { initialPartidos: any[] }) {
  const [partidos, setPartidos] = useState(initialPartidos);
  const [filtro, setFiltro] = useState<"Todos" | "Rugby" | "Hockey">("Todos");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  // Lógica de filtrado
  const partidosMostrados = filtro === "Todos" 
    ? partidos 
    : partidos.filter(p => p.deporte === filtro);

  const handleDelete = async (id: number, local: string, visita: string) => {
    if (!confirm(`¿Estás seguro de borrar el partido ${local} vs ${visita}?`)) return;

    setIsDeleting(id);
    const { error } = await supabase.from('partidos').delete().eq('id', id);

    if (error) {
      alert("Error al borrar: " + error.message);
    } else {
      setPartidos(partidos.filter(p => p.id !== id));
      router.refresh();
    }
    setIsDeleting(null);
  };

  return (
    <div className="space-y-8">
      
      {/* SELECTOR DE FILTRO - ESTILO RIVA ESTUDIO */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50 p-2 rounded-2xl border border-zinc-100">
        <div className="flex items-center gap-2 px-4 py-2 text-zinc-400">
          <Filter className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Filtrar por:</span>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {["Todos", "Rugby", "Hockey"].map((opcion) => (
            <button
              key={opcion}
              onClick={() => setFiltro(opcion as any)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filtro === opcion 
                ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20' 
                : 'bg-white text-zinc-400 border border-zinc-100 hover:border-zinc-200'
              }`}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>

      {/* LISTADO DINÁMICO */}
      <div className="grid grid-cols-1 gap-4">
        {partidosMostrados.length > 0 ? (
          partidosMostrados.map((partido) => {
            const fechaObj = new Date(partido.fecha_programada);
            const diaVisual = fechaObj.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' });
            const horaVisual = fechaObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
            const huazihulEsLocal = partido.equipo_local.toUpperCase().includes("HUAZIHUL");

            return (
              <div 
                key={partido.id} 
                className="group relative overflow-hidden bg-white border border-zinc-100 rounded-2xl p-6 transition-all hover:border-red-100 hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  
                  {/* Fecha y Disciplina */}
                  <div className="flex flex-col min-w-[120px]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">
                      {diaVisual} · {horaVisual} HS
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${partido.deporte === 'Rugby' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">{partido.deporte}</span>
                    </div>
                  </div>

                  {/* Equipos y Marcador */}
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex-1 text-right">
                      <span className={`text-lg font-black uppercase tracking-tighter ${huazihulEsLocal ? 'text-zinc-900' : 'text-zinc-400'}`}>
                        {partido.equipo_local}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100 group-hover:bg-zinc-100 transition-colors">
                      <span className="text-2xl font-black text-zinc-900">{partido.resultado_local ?? "-"}</span>
                      <span className="text-zinc-300 font-bold italic text-xs">VS</span>
                      <span className="text-2xl font-black text-zinc-900">{partido.resultado_visitante ?? "-"}</span>
                    </div>

                    <div className="flex-1 text-left">
                      <span className={`text-lg font-black uppercase tracking-tighter ${!huazihulEsLocal ? 'text-zinc-900' : 'text-zinc-400'}`}>
                        {partido.equipo_visitante}
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-6 border-zinc-100">
                    <Link 
                      href={`/admin/partidos/editar/${partido.id}`}
                      className="p-3 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(partido.id, partido.equipo_local, partido.equipo_visitante)}
                      disabled={isDeleting === partido.id}
                      className="p-3 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      {isDeleting === partido.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-[2.5rem] bg-zinc-50/50">
            <Trophy className="mx-auto h-12 w-12 text-zinc-200 mb-4" />
            <p className="text-sm font-black uppercase tracking-widest text-zinc-400">No hay partidos para {filtro}</p>
          </div>
        )}
      </div>
    </div>
  );
}