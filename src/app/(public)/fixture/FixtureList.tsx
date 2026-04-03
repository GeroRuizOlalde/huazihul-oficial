"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

type Filtro = "Todos" | "Rugby" | "Hockey";

type Partido = {
  id: number;
  deporte: Exclude<Filtro, "Todos">;
  fecha_programada: string;
  equipo_local: string;
  equipo_visitante: string;
  resultado_local: number | null;
  resultado_visitante: number | null;
  cancha: string;
};

export function FixtureList({ partidos }: { partidos: Partido[] }) {
  const [filtro, setFiltro] = useState<Filtro>("Todos");

  const partidosFiltrados = filtro === "Todos" 
    ? partidos 
    : partidos.filter(p => p.deporte === filtro);

  const futuros = partidosFiltrados.filter(p => new Date(p.fecha_programada) >= new Date());
  const pasados = partidosFiltrados.filter(p => new Date(p.fecha_programada) < new Date()).reverse();

  return (
    <div>
      {/* BOTONES DE FILTRO */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {["Todos", "Rugby", "Hockey"].map((opcion) => (
          <button
            key={opcion}
            onClick={() => setFiltro(opcion as Filtro)}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
              filtro === opcion 
              ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' 
              : 'bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200'
            }`}
          >
            {opcion}
          </button>
        ))}
      </div>

      {/* SECCIÓN: PRÓXIMOS PARTIDOS */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-1 w-12 bg-red-600"></div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Próximos Encuentros</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {futuros.length > 0 ? (
            futuros.map((partido) => <PartidoCard key={partido.id} partido={partido} esFuturo={true} />)
          ) : (
            <div className="p-16 border-2 border-dashed border-zinc-100 text-center rounded-3xl bg-zinc-50/50">
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No hay partidos de {filtro} programados.</p>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN: RESULTADOS RECIENTES */}
      <div>
        <div className="flex items-center gap-4 mb-10">
          <div className="h-1 w-12 bg-zinc-300"></div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-zinc-400">Resultados Recientes</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {pasados.length > 0 ? (
            pasados.slice(0, 8).map((partido) => <PartidoCard key={partido.id} partido={partido} esFuturo={false} />)
          ) : (
            <p className="text-zinc-400 italic text-center py-10">No hay resultados registrados para {filtro}.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PartidoCard({
  partido,
  esFuturo,
}: {
  partido: Partido;
  esFuturo: boolean;
}) {
  const fecha = new Date(partido.fecha_programada);
  const dia = fecha.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: '2-digit' });
  const hora = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const huazihulEsLocal = partido.equipo_local.toUpperCase().includes("HUAZIHUL");

  return (
    <div className={`group relative bg-white border rounded-2xl p-6 md:p-10 transition-all hover:border-red-600/20 hover:shadow-2xl shadow-zinc-200/50 ${!esFuturo && 'opacity-75 grayscale-[0.5]'}`}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Info Fecha */}
        <div className="flex flex-col items-center lg:items-start gap-1 min-w-[140px]">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">{dia}</span>
          <span className="text-3xl font-black tracking-tighter text-zinc-900">{hora} HS</span>
          <Badge className="mt-2 bg-zinc-100 text-zinc-500 border-none rounded-none text-[8px] uppercase font-black tracking-widest">
            {partido.deporte}
          </Badge>
        </div>

        {/* El Enfrentamiento */}
        <div className="flex flex-1 items-center justify-center gap-4 md:gap-12 w-full">
          <div className="flex-1 text-right">
            <h4 className={`text-xl md:text-4xl font-black uppercase tracking-tighter leading-none ${huazihulEsLocal ? 'text-zinc-950' : 'text-zinc-400'}`}>
              {partido.equipo_local}
            </h4>
          </div>

          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 ${esFuturo ? 'bg-zinc-50 border-zinc-100' : 'bg-zinc-950 border-zinc-800 text-white shadow-xl shadow-red-900/20'}`}>
            <span className="text-2xl md:text-5xl font-black">{partido.resultado_local ?? (esFuturo ? "-" : "0")}</span>
            <span className="text-red-600 font-black italic text-sm px-1">VS</span>
            <span className="text-2xl md:text-5xl font-black">{partido.resultado_visitante ?? (esFuturo ? "-" : "0")}</span>
          </div>

          <div className="flex-1 text-left">
            <h4 className={`text-xl md:text-4xl font-black uppercase tracking-tighter leading-none ${!huazihulEsLocal ? 'text-zinc-950' : 'text-zinc-400'}`}>
              {partido.equipo_visitante}
            </h4>
          </div>
        </div>

        {/* Lugar */}
        <div className="flex flex-col items-center lg:items-end gap-2 min-w-[180px] border-t lg:border-t-0 lg:border-l border-zinc-100 pt-6 lg:pt-0 lg:pl-10 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-zinc-500">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-widest">{partido.cancha}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
