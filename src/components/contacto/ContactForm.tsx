"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const supabase = createClient();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg("");
    setIsSubmitting(true);

    const { error } = await supabase.from("mensajes_contacto").insert([
      {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        asunto: form.asunto.trim() || null,
        mensaje: form.mensaje.trim(),
      },
    ]);

    if (error) {
      setErrorMsg("No pudimos enviar tu mensaje. Intentá de nuevo.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 className="mb-6 h-16 w-16 text-green-500" />
        <h3 className="mb-2 text-2xl font-black uppercase tracking-tighter text-white">
          ¡Mensaje enviado!
        </h3>
        <p className="font-light text-zinc-400">
          Te responderemos a la brevedad por email o WhatsApp.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false);
            setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
          }}
          className="mt-8 text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-400"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3">
          <p className="text-sm font-medium text-red-400">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="cf-nombre"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500"
          >
            Nombre
          </Label>
          <Input
            id="cf-nombre"
            required
            placeholder="Tu nombre"
            className="h-12 rounded-xl border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-600 focus:border-red-600 focus:ring-red-600"
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="cf-email"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500"
          >
            Email
          </Label>
          <Input
            id="cf-email"
            required
            type="email"
            placeholder="tu@email.com"
            className="h-12 rounded-xl border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-600 focus:border-red-600 focus:ring-red-600"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="cf-asunto"
          className="text-[10px] font-black uppercase tracking-widest text-zinc-500"
        >
          Asunto{" "}
          <span className="normal-case tracking-normal text-zinc-600">
            (opcional)
          </span>
        </Label>
        <Input
          id="cf-asunto"
          placeholder="¿De qué se trata?"
          className="h-12 rounded-xl border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-600 focus:border-red-600 focus:ring-red-600"
          value={form.asunto}
          onChange={(e) => handleChange("asunto", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="cf-mensaje"
          className="text-[10px] font-black uppercase tracking-widest text-zinc-500"
        >
          Mensaje
        </Label>
        <Textarea
          id="cf-mensaje"
          required
          placeholder="Escribí tu consulta acá..."
          className="min-h-[140px] rounded-xl border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-red-600"
          value={form.mensaje}
          onChange={(e) => handleChange("mensaje", e.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-none bg-red-600 py-7 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-red-700 disabled:opacity-70"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Enviar Mensaje
          </>
        )}
      </Button>
    </form>
  );
}