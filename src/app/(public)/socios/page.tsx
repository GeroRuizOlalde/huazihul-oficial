"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Loader2, Users, Heart, ShieldCheck } from "lucide-react";

export default function SociosPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    deporte_interes: "Rugby",
    mensaje: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('socios_aspirantes')
      .insert([form]);

    if (!error) {
      setIsSuccess(true);
    } else {
      alert("Hubo un error: " + error.message);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md animate-in zoom-in duration-500">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">¡Solicitud Enviada!</h2>
          <p className="text-zinc-500 font-light mb-8">
            Ya recibimos tus datos. Un coordinador del club se pondrá en contacto con vos por WhatsApp o Email para finalizar tu inscripción.
          </p>
          <Button className="bg-zinc-950 text-white rounded-none px-10 py-6 uppercase font-black tracking-widest text-xs" onClick={() => window.location.href = "/"}>
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      
      {/* HEADER */}
      <section className="bg-zinc-950 py-24 border-b-8 border-red-600">
        <div className="container px-6 md:px-8">
          <Badge className="bg-red-600 text-white rounded-none mb-4 tracking-[0.3em] uppercase text-[10px] border-none">
            Membresía {new Date().getFullYear()}
          </Badge>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-white leading-[0.8]">
            Formá parte de <br /> <span className="text-red-600">La Familia</span>
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* INFO LADO IZQUIERDO */}
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="h-1.5 w-12 bg-red-600"></div>
                <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">¿Por qué ser <br/> socio de Huazihul?</h2>
                <p className="text-zinc-500 font-light max-w-sm leading-relaxed">
                  Más que un club, somos una comunidad que educa a través del deporte. Asociate y disfrutá de todos los beneficios.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-zinc-100 p-3 rounded-2xl"><Users className="w-6 h-6 text-red-600" /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm tracking-tight">Acceso a Disciplinas</h4>
                    <p className="text-xs text-zinc-500 font-light">Rugby y Hockey en todas sus categorías competitivas y recreativas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-zinc-100 p-3 rounded-2xl"><Heart className="w-6 h-6 text-red-600" /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm tracking-tight">Vida Social</h4>
                    <p className="text-xs text-zinc-500 font-light">Uso de instalaciones, quinchos y participación en eventos del club.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-zinc-100 p-3 rounded-2xl"><ShieldCheck className="w-6 h-6 text-red-600" /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm tracking-tight">Sentido de Pertenencia</h4>
                    <p className="text-xs text-zinc-500 font-light">Formar parte de una institución con casi 100 años de historia.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FORMULARIO LADO DERECHO */}
            <form onSubmit={handleSubmit} className="bg-zinc-50 p-8 md:p-12 rounded-[2.5rem] border border-zinc-100 shadow-2xl shadow-zinc-200/50 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nombre</Label>
                  <Input required className="rounded-xl border-zinc-200 h-12" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Apellido</Label>
                  <Input required className="rounded-xl border-zinc-200 h-12" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">DNI</Label>
                  <Input required className="rounded-xl border-zinc-200 h-12" value={form.dni} onChange={e => setForm({...form, dni: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Fecha de Nacimiento</Label>
                  <Input required type="date" className="rounded-xl border-zinc-200 h-12" value={form.fecha_nacimiento} onChange={e => setForm({...form, fecha_nacimiento: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email</Label>
                  <Input required type="email" className="rounded-xl border-zinc-200 h-12" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">WhatsApp / Teléfono</Label>
                  <Input required placeholder="Ej: 264 4567890" className="rounded-xl border-zinc-200 h-12" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Disciplina de interés</Label>
                <div className="flex gap-4">
                  {["Rugby", "Hockey", "Solo Social"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm({...form, deporte_interes: d})}
                      className={`flex-1 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        form.deporte_interes === d ? 'border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/20' : 'border-zinc-200 text-zinc-400 bg-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mensaje o consulta (opcional)</Label>
                <Textarea className="rounded-xl border-zinc-200 min-h-[100px]" value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white py-8 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-red-600/20 transition-all active:scale-[0.98]">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Enviar Solicitud de Ingreso"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}