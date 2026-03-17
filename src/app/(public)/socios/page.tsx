"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Users, Heart, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

export default function SociosPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    deporte_interes: "Rugby",
    mensaje: "",
  });

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setErrorMsg("");
    setIsSubmitting(true);

    const payload = {
      ...form,
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      dni: form.dni.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      mensaje: form.mensaje.trim(),
    };

    const { error } = await supabase.from("socios_aspirantes").insert([payload]);

    if (error) {
      setErrorMsg(`Hubo un error al enviar la solicitud: ${error.message}`);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6 text-center selection:bg-red-600 selection:text-white">
        <div className="max-w-md animate-in zoom-in duration-500">
          <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-green-500" />

          <h2 className="mb-4 text-4xl font-black uppercase tracking-tighter text-zinc-900">
            ¡Solicitud Enviada!
          </h2>

          <p className="mb-8 font-light text-zinc-500">
            Ya recibimos tus datos. Un coordinador del club se pondrá en
            contacto con vos por WhatsApp o email para finalizar tu inscripción.
          </p>

          <Button
            className="rounded-none bg-zinc-950 px-10 py-6 text-xs font-black uppercase tracking-widest text-white"
            onClick={() => router.push("/")}
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      {/* HEADER */}
      <section className="border-b-8 border-red-600 bg-zinc-950 py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <Badge className="mb-4 rounded-none border-none bg-red-600 text-[10px] uppercase tracking-[0.3em] text-white">
            Membresía {new Date().getFullYear()}
          </Badge>

          <h1 className="text-6xl font-black uppercase italic leading-[0.8] tracking-tighter text-white md:text-9xl">
            Formá parte de <br /> <span className="text-red-600">La Familia</span>
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
            {/* INFO */}
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="h-1.5 w-12 bg-red-600" />
                <h2 className="text-4xl font-black uppercase leading-none tracking-tighter text-zinc-900">
                  ¿Por qué ser <br /> socio de Huazihul?
                </h2>
                <p className="max-w-sm font-light leading-relaxed text-zinc-500">
                  Más que un club, somos una comunidad que educa a través del
                  deporte. Asociate y disfrutá de todos los beneficios.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-zinc-100 p-3">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-zinc-900">
                      Acceso a Disciplinas
                    </h4>
                    <p className="text-xs font-light text-zinc-500">
                      Rugby y Hockey en todas sus categorías competitivas y
                      recreativas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-zinc-100 p-3">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-zinc-900">
                      Vida Social
                    </h4>
                    <p className="text-xs font-light text-zinc-500">
                      Uso de instalaciones, quinchos y participación en eventos
                      del club.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-zinc-100 p-3">
                    <ShieldCheck className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-zinc-900">
                      Sentido de Pertenencia
                    </h4>
                    <p className="text-xs font-light text-zinc-500">
                      Formar parte de una institución con casi 100 años de
                      historia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FORMULARIO */}
            <form
              onSubmit={handleSubmit}
              className="space-y-8 rounded-[2.5rem] border border-zinc-100 bg-zinc-50 p-8 shadow-2xl shadow-zinc-200/50 md:p-12"
            >
              {errorMsg && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-600">{errorMsg}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="nombre"
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                  >
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    required
                    className="h-12 rounded-xl border-zinc-200"
                    value={form.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="apellido"
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                  >
                    Apellido
                  </Label>
                  <Input
                    id="apellido"
                    required
                    className="h-12 rounded-xl border-zinc-200"
                    value={form.apellido}
                    onChange={(e) => handleChange("apellido", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="dni"
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                  >
                    DNI
                  </Label>
                  <Input
                    id="dni"
                    required
                    inputMode="numeric"
                    className="h-12 rounded-xl border-zinc-200"
                    value={form.dni}
                    onChange={(e) => handleChange("dni", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="fecha_nacimiento"
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                  >
                    Fecha de Nacimiento
                  </Label>
                  <Input
                    id="fecha_nacimiento"
                    required
                    type="date"
                    className="h-12 rounded-xl border-zinc-200"
                    value={form.fecha_nacimiento}
                    onChange={(e) =>
                      handleChange("fecha_nacimiento", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    required
                    type="email"
                    className="h-12 rounded-xl border-zinc-200"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="telefono"
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                  >
                    WhatsApp / Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    required
                    inputMode="tel"
                    placeholder="Ej: 264 4567890"
                    className="h-12 rounded-xl border-zinc-200"
                    value={form.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Disciplina de interés
                </Label>

                <div className="flex gap-4">
                  {["Rugby", "Hockey", "Solo Social"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleChange("deporte_interes", d)}
                      className={`flex-1 rounded-xl border-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                        form.deporte_interes === d
                          ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/20"
                          : "border-zinc-200 bg-white text-zinc-400"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mensaje"
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                >
                  Mensaje o consulta (opcional)
                </Label>
                <Textarea
                  id="mensaje"
                  className="min-h-[100px] rounded-xl border-zinc-200"
                  value={form.mensaje}
                  onChange={(e) => handleChange("mensaje", e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-red-600 py-8 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-red-600/20 transition-all active:scale-[0.98] hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Enviar Solicitud de Ingreso"
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}