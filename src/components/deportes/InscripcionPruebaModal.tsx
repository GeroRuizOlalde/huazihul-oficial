"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2, Calendar, Phone, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  deporte: "rugby" | "hockey";
}

export function InscripcionPruebaModal({ deporte }: Props) {
  const supabase = createClient();
  const [abierto, setAbierto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    nombre_completo: "",
    fecha_nacimiento: "",
    telefono_contacto: "",
    tutor_nombre: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Calcular si es menor de edad (< 18 años)
  const esMenor = () => {
    if (!form.fecha_nacimiento) return false;
    const hoy = new Date();
    const nac = new Date(form.fecha_nacimiento);
    const edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    return edad < 18 || (edad === 18 && m < 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg("");
    setIsSubmitting(true);

    const { error } = await supabase.from("inscripciones_prueba").insert([
      {
        nombre_completo: form.nombre_completo.trim(),
        fecha_nacimiento: form.fecha_nacimiento,
        deporte: deporte,
        telefono_contacto: form.telefono_contacto.trim(),
        tutor_nombre: form.tutor_nombre.trim() || null,
        estado: "pendiente",
      },
    ]);

    if (error) {
      setErrorMsg("No pudimos registrar tu solicitud. Intentá de nuevo.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const cerrar = () => {
    setAbierto(false);
    setTimeout(() => {
      setIsSuccess(false);
      setErrorMsg("");
      setForm({
        nombre_completo: "",
        fecha_nacimiento: "",
        telefono_contacto: "",
        tutor_nombre: "",
      });
    }, 300);
  };

  const bgBtn =
    deporte === "rugby"
      ? "bg-white text-black hover:bg-red-600 hover:text-white"
      : "bg-white text-black hover:bg-amber-500 hover:text-white";
  const accentBg = deporte === "rugby" ? "bg-red-600" : "bg-amber-500";
  const accentText = deporte === "rugby" ? "text-red-600" : "text-amber-500";

  return (
    <>
      {/* TRIGGER */}
      <button
        onClick={() => setAbierto(true)}
        className={`inline-flex items-center gap-2 rounded-none px-10 py-7 text-sm font-black uppercase tracking-widest shadow-xl transition-all ${bgBtn}`}
      >
        Inscribirse a una clase de prueba
      </button>

      {/* OVERLAY */}
      {abierto && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrar();
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            {/* HEADER */}
            <div className={`relative flex items-center justify-between ${accentBg} p-8`}>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                  Clase de Prueba
                </span>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                  {deporte === "rugby" ? "Rugby" : "Hockey"} Huazihul
                </h2>
              </div>
              <button
                onClick={cerrar}
                className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-8 text-zinc-900">
              {isSuccess ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
                  <h3 className="mb-2 text-xl font-black uppercase tracking-tighter text-zinc-900">
                    ¡Solicitud enviada!
                  </h3>
                  <p className="text-sm font-light text-zinc-500">
                    Te vamos a contactar por WhatsApp para coordinar la fecha y horario de tu clase.
                  </p>
                  <button
                    onClick={cerrar}
                    className={`mt-8 text-xs font-black uppercase tracking-widest ${accentText}`}
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-600">{errorMsg}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="ip-nombre"
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >
                      <User className="h-3 w-3" />
                      Nombre completo
                    </Label>
                    <Input
                      id="ip-nombre"
                      required
                      placeholder="Ej: Juan Pérez"
                      className="h-12 rounded-xl border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"
                      value={form.nombre_completo}
                      onChange={(e) => handleChange("nombre_completo", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="ip-fecha"
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >
                      <Calendar className="h-3 w-3" />
                      Fecha de nacimiento
                    </Label>
                    <Input
                      id="ip-fecha"
                      required
                      type="date"
                      className="h-12 rounded-xl border-zinc-200 bg-white text-zinc-900"
                      value={form.fecha_nacimiento}
                      onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
                    />
                  </div>

                  {/* Campo tutor: aparece solo si es menor */}
                  {esMenor() && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="ip-tutor"
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400"
                      >
                        <User className="h-3 w-3" />
                        Nombre del tutor / padre o madre
                      </Label>
                      <Input
                        id="ip-tutor"
                        required
                        placeholder="Ej: María García"
                        className="h-12 rounded-xl border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"
                        value={form.tutor_nombre}
                        onChange={(e) => handleChange("tutor_nombre", e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="ip-tel"
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >
                      <Phone className="h-3 w-3" />
                      WhatsApp / Teléfono
                    </Label>
                    <Input
                      id="ip-tel"
                      required
                      inputMode="tel"
                      placeholder="Ej: 264 4567890"
                      className="h-12 rounded-xl border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"
                      value={form.telefono_contacto}
                      onChange={(e) => handleChange("telefono_contacto", e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full rounded-2xl py-7 text-xs font-black uppercase tracking-widest text-white transition-all ${accentBg} disabled:opacity-70`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Quiero mi clase de prueba"
                    )}
                  </Button>

                  <p className="text-center text-[10px] text-zinc-400">
                    Te contactaremos a la brevedad para coordinar fecha y horario.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
