"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Calendar as CalendarIcon, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NuevoPartidoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    equipo_local: "HUAZIHUL",
    equipo_visitante: "",
    fecha_dia: "", 
    horario: "",   
    cancha: "Cancha 1 - Huazihul",
    deporte: "Rugby", 
  });

  // Lógica visual para detectar localía
  const huazihulEsLocal = form.equipo_local.toUpperCase().includes("HUAZIHUL");
  const huazihulEsVisita = form.equipo_visitante.toUpperCase().includes("HUAZIHUL");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fecha_dia || !form.horario) {
      alert("Por favor, completá fecha y hora.");
      return;
    }

    setIsSaving(true);
  
    try {
      // Creamos el objeto de fecha real (ISO) que Supabase ordenará automáticamente
      const fechaReal = new Date(`${form.fecha_dia}T${form.horario}:00`);
  
      const { error } = await supabase
        .from('partidos')
        .insert([
          {
            equipo_local: form.equipo_local,
            equipo_visitante: form.equipo_visitante,
            fecha_programada: fechaReal.toISOString(), 
            cancha: form.cancha,
            deporte: form.deporte,
            // Quitamos 'es_proximo' manual. El sistema usará 'fecha_programada' 
            // para saber cuál es el siguiente.
          }
        ]);

      if (error) throw error;

      // Volvemos a la lista
      router.push("/admin/partidos");
      router.refresh();

    } catch (err: any) {
      alert("Error al guardar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-20">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/partidos" className="p-2 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-black uppercase tracking-tighter">
          Cargar <span className="text-red-600">Nuevo Encuentro</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-none shadow-xl shadow-zinc-200/50">
          <CardContent className="p-8 space-y-8">
            
            {/* Disciplina */}
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Disciplina</Label>
              <div className="flex gap-4">
                {["Rugby", "Hockey"].map((dep) => (
                  <button
                    key={dep}
                    type="button"
                    onClick={() => setForm({...form, deporte: dep})}
                    className={`flex-1 py-4 rounded-xl border-2 font-bold uppercase tracking-widest text-xs transition-all ${
                      form.deporte === dep 
                      ? 'border-red-600 bg-red-50 text-red-600' 
                      : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'
                    }`}
                  >
                    {dep}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipos con Feedback Visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-2xl border-2 transition-all ${huazihulEsLocal ? 'border-red-200 bg-red-50/50 shadow-inner' : 'border-zinc-100 bg-zinc-50'}`}>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-3">Equipo Local</Label>
                <Input 
                  required 
                  value={form.equipo_local} 
                  onChange={e => setForm({...form, equipo_local: e.target.value.toUpperCase()})} 
                  className="bg-white font-black text-lg h-12" 
                />
                {huazihulEsLocal && <span className="text-[9px] font-black text-red-600 uppercase mt-2 block animate-pulse">Huazihul Local</span>}
              </div>
              
              <div className={`p-6 rounded-2xl border-2 transition-all ${huazihulEsVisita ? 'border-red-200 bg-red-50/50 shadow-inner' : 'border-zinc-100 bg-zinc-50'}`}>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-3">Equipo Visitante</Label>
                <Input 
                  required 
                  value={form.equipo_visitante} 
                  onChange={e => setForm({...form, equipo_visitante: e.target.value.toUpperCase()})} 
                  className="bg-white font-black text-lg h-12" 
                />
                {huazihulEsVisita && <span className="text-[9px] font-black text-red-600 uppercase mt-2 block animate-pulse">Huazihul Visitante</span>}
              </div>
            </div>

            {/* Fecha y Hora Intelligente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <CalendarIcon className="w-3 h-3 text-red-600" /> Fecha del Encuentro
                </Label>
                <Input type="date" required value={form.fecha_dia} onChange={e => setForm({...form, fecha_dia: e.target.value})} className="h-12 rounded-xl border-zinc-200" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-red-600" /> Horario de Inicio
                </Label>
                <Input type="time" required value={form.horario} onChange={e => setForm({...form, horario: e.target.value})} className="h-12 rounded-xl border-zinc-200" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Cancha / Ubicación</Label>
              <Input required value={form.cancha} onChange={e => setForm({...form, cancha: e.target.value})} className="h-12 rounded-xl border-zinc-200" />
            </div>

            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
              <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                * Nota: El sistema detectará automáticamente si este es el próximo partido basándose en la fecha y hora cargadas.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isSaving} 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-600/20 transition-all active:scale-[0.98]"
            >
              {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="mr-2 h-5 w-5" /> Publicar Partido</>}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}