"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Calendar as CalendarIcon, Clock, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditarPartidoPage() {
  const router = useRouter();
  const { id } = useParams();
  const supabase = createClient();
  
  // Candado para evitar que el useEffect pise lo que escribís mientras editás
  const hasLoaded = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    equipo_local: "",
    equipo_visitante: "",
    resultado_local: "" as string | number,
    resultado_visitante: "" as string | number,
    fecha_dia: "",
    horario: "",
    cancha: "",
    deporte: "Rugby",
    es_proximo: false
  });

  const huazihulEsLocal = form.equipo_local.toUpperCase().includes("HUAZIHUL");
  const huazihulEsVisita = form.equipo_visitante.toUpperCase().includes("HUAZIHUL");

  useEffect(() => {
    if (hasLoaded.current) return;

    const fetchPartido = async () => {
      const { data, error } = await supabase
        .from('partidos')
        .select('*')
        .eq('id', Number(id))
        .single();
      
      if (!error && data) {
        // Intentamos pre-cargar la hora si ya existía
        const horaOriginal = data.fecha_programada 
          ? new Date(data.fecha_programada).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }) 
          : "";

        setForm({
          ...data,
          resultado_local: data.resultado_local ?? "",
          resultado_visitante: data.resultado_visitante ?? "",
          horario: horaOriginal,
          fecha_dia: "" // Obligamos a elegir fecha para asegurar el formato ISO nuevo
        });
        hasLoaded.current = true;
      }
      setIsLoading(false);
    };

    if (id) fetchPartido();
  }, [id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");

    try {
      const idNumerico = Number(id);
      
      // Creamos el objeto de fecha real para la base de datos
      // Solo lo actualizamos si el admin eligió una fecha en el calendario
      let updatePayload: any = {
        equipo_local: form.equipo_local,
        equipo_visitante: form.equipo_visitante,
        resultado_local: form.resultado_local === "" ? null : Number(form.resultado_local),
        resultado_visitante: form.resultado_visitante === "" ? null : Number(form.resultado_visitante),
        cancha: form.cancha,
        deporte: form.deporte,
        es_proximo: form.es_proximo
      };

      if (form.fecha_dia && form.horario) {
        const fechaReal = new Date(`${form.fecha_dia}T${form.horario}:00`);
        updatePayload.fecha_programada = fechaReal.toISOString();
      }

      // Si marcamos como próximo, desmarcamos los demás manualmente (por seguridad)
      if (form.es_proximo) {
        await supabase.from('partidos').update({ es_proximo: false }).eq('es_proximo', true).neq('id', idNumerico);
      }

      const { error } = await supabase
        .from('partidos')
        .update(updatePayload)
        .eq('id', idNumerico);

      if (error) throw error;

      router.push("/admin/partidos");
      router.refresh();

    } catch (err: any) {
      setErrorMsg(err.message || "Error al actualizar el partido.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-red-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 pb-20 px-4">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/partidos" className="p-2 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 transition-colors shadow-sm">
          <ArrowLeft className="h-4 w-4 text-zinc-600" />
        </Link>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">
          Editar / <span className="text-red-600">Cerrar Partido</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-none shadow-xl shadow-zinc-200/50 overflow-hidden">
          <CardContent className="p-6 md:p-10 space-y-10">
            
            {/* --- SECCIÓN 1: DISCIPLINA --- */}
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Disciplina / Deporte</Label>
              <div className="flex gap-4">
                {["Rugby", "Hockey"].map((dep) => (
                  <button
                    key={dep}
                    type="button"
                    onClick={() => setForm({...form, deporte: dep})}
                    className={`flex-1 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-xs transition-all ${
                      form.deporte === dep 
                      ? 'border-red-600 bg-red-50 text-red-600 shadow-md shadow-red-600/10' 
                      : 'border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200'
                    }`}
                  >
                    {dep}
                  </button>
                ))}
              </div>
            </div>

            {/* --- SECCIÓN 2: MARCADOR --- */}
            <div className="bg-zinc-950 p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl shadow-red-900/10 border border-white/5">
              <div className="flex items-center justify-center gap-6 md:gap-16">
                <div className="flex-1 text-center space-y-4">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] block truncate ${huazihulEsLocal ? 'text-red-500' : 'text-zinc-500'}`}>
                    {form.equipo_local || "Local"}
                  </span>
                  <Input 
                    type="number" 
                    placeholder="0"
                    className="h-20 md:h-24 text-4xl md:text-5xl text-center font-black rounded-3xl bg-white/5 border-white/10 text-white focus:ring-red-600 focus:border-red-600 transition-all"
                    value={form.resultado_local} 
                    onChange={e => setForm({...form, resultado_local: e.target.value})} 
                  />
                </div>

                <div className="text-2xl font-black text-zinc-800 italic">VS</div>

                <div className="flex-1 text-center space-y-4">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] block truncate ${huazihulEsVisita ? 'text-red-500' : 'text-zinc-500'}`}>
                    {form.equipo_visitante || "Visita"}
                  </span>
                  <Input 
                    type="number" 
                    placeholder="0"
                    className="h-20 md:h-24 text-4xl md:text-5xl text-center font-black rounded-3xl bg-white/5 border-white/10 text-white focus:ring-red-600 focus:border-red-600 transition-all"
                    value={form.resultado_visitante} 
                    onChange={e => setForm({...form, resultado_visitante: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            {/* --- SECCIÓN 3: DATOS DEL EQUIPO --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nombre Local</Label>
                <Input 
                  value={form.equipo_local} 
                  onChange={e => setForm({...form, equipo_local: e.target.value.toUpperCase()})} 
                  className="h-12 border-zinc-200 rounded-xl focus:ring-red-600"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nombre Visitante</Label>
                <Input 
                  value={form.equipo_visitante} 
                  onChange={e => setForm({...form, equipo_visitante: e.target.value.toUpperCase()})} 
                  className="h-12 border-zinc-200 rounded-xl focus:ring-red-600"
                />
              </div>
            </div>

            {/* --- SECCIÓN 4: FECHA Y LUGAR --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <CalendarIcon className="w-3 h-3 text-red-600" /> Fecha
                </Label>
                <Input type="date" value={form.fecha_dia} onChange={e => setForm({...form, fecha_dia: e.target.value})} className="h-12 rounded-xl border-zinc-200" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-red-600" /> Horario
                </Label>
                <Input type="time" value={form.horario} onChange={e => setForm({...form, horario: e.target.value})} className="h-12 rounded-xl border-zinc-200" />
              </div>
            </div>

            <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Cancha / Lugar</Label>
                <Input value={form.cancha} onChange={e => setForm({...form, cancha: e.target.value})} className="h-12 rounded-xl border-zinc-200" />
            </div>

            {/* --- SECCIÓN 5: STATUS --- */}
            <label className="flex items-center gap-4 p-5 bg-zinc-50 rounded-2xl cursor-pointer hover:bg-zinc-100 transition-colors border border-zinc-100 group">
              <input 
                type="checkbox" 
                className="w-6 h-6 rounded-lg accent-red-600 transition-transform group-active:scale-90" 
                checked={form.es_proximo} 
                onChange={e => setForm({...form, es_proximo: e.target.checked})}
              />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Destacar como Próximo Partido</span>
                <span className="text-[10px] text-zinc-500 font-medium">Forzar aparición en el ticker de la página principal.</span>
              </div>
            </label>

            <Button 
              type="submit" 
              disabled={isSaving} 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-8 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-red-600/20 transition-all active:scale-[0.98]"
            >
              {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="mr-2 h-5 w-5" /> Guardar Cambios</>}
            </Button>

            {errorMsg && (
              <p className="text-center text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{errorMsg}</p>
            )}

          </CardContent>
        </Card>
      </form>
    </div>
  );
}