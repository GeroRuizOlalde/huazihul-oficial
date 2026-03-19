"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, MailOpen, Trash2, Loader2, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Mensaje {
  id: number;
  nombre: string;
  email: string;
  asunto: string | null;
  mensaje: string;
  leido: boolean;
  creado_en: string;
}

export default function AdminMensajesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("mensajes_contacto")
        .select("*")
        .order("creado_en", { ascending: false });

      if (error) setErrorMsg("No pudimos cargar los mensajes.");
      else setMensajes(data || []);
      setIsLoading(false);
    };
    fetch();
  }, [supabase]);

  const marcarLeido = async (id: number) => {
    setActionId(id);
    const { error } = await supabase
      .from("mensajes_contacto")
      .update({ leido: true })
      .eq("id", id);

    if (!error) {
      setMensajes((prev) =>
        prev.map((m) => (m.id === id ? { ...m, leido: true } : m))
      );
    }
    setActionId(null);
  };

  const eliminar = async (id: number) => {
    if (!window.confirm("¿Eliminar este mensaje permanentemente?")) return;
    setActionId(id);
    const { error } = await supabase
      .from("mensajes_contacto")
      .delete()
      .eq("id", id);

    if (!error) setMensajes((prev) => prev.filter((m) => m.id !== id));
    setActionId(null);
  };

  const handleExpandir = async (msg: Mensaje) => {
    if (expandido === msg.id) {
      setExpandido(null);
      return;
    }
    setExpandido(msg.id);
    if (!msg.leido) await marcarLeido(msg.id);
  };

  const noLeidos = mensajes.filter((m) => !m.leido).length;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-black uppercase tracking-tighter text-zinc-900">
            Mensajes de <span className="text-red-600">Contacto</span>
          </h1>
          <p className="text-sm font-light text-zinc-500">
            Consultas recibidas desde el formulario del sitio.
          </p>
        </div>
        {noLeidos > 0 && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-5 py-3">
            <Mail className="h-4 w-4 text-red-600" />
            <span className="text-sm font-black uppercase tracking-widest text-red-600">
              {noLeidos} sin leer
            </span>
          </div>
        )}
      </header>

      {errorMsg && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{errorMsg}</p>
        </div>
      )}

      {mensajes.length > 0 ? (
        <div className="space-y-3">
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              className={`overflow-hidden rounded-2xl border transition-all ${
                !msg.leido
                  ? "border-red-200 bg-red-50/50"
                  : "border-zinc-100 bg-white"
              }`}
            >
              {/* CABECERA (siempre visible) */}
              <button
                className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-zinc-50"
                onClick={() => handleExpandir(msg)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                  {msg.leido ? (
                    <MailOpen className="h-5 w-5 text-zinc-400" />
                  ) : (
                    <Mail className="h-5 w-5 text-red-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-black uppercase tracking-tight text-zinc-900">
                      {msg.nombre}
                    </span>
                    {!msg.leido && (
                      <Badge className="rounded-none border-none bg-red-600 px-2 py-0.5 text-[9px] uppercase tracking-widest text-white">
                        Nuevo
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span>{msg.email}</span>
                    {msg.asunto && (
                      <>
                        <span>·</span>
                        <span className="font-medium text-zinc-700">
                          {msg.asunto}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {new Date(msg.creado_en).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </span>
              </button>

              {/* CONTENIDO EXPANDIDO */}
              {expandido === msg.id && (
                <div className="border-t border-zinc-100 bg-white px-5 pb-5 pt-4">
                  <p className="mb-6 whitespace-pre-wrap text-sm font-light leading-relaxed text-zinc-700">
                    {msg.mensaje}
                  </p>

                  <div className="flex items-center gap-3">
                    <Button
                      asChild
                      className="rounded-xl bg-zinc-900 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-zinc-800"
                    >
                      <a href={`mailto:${msg.email}?subject=Re: ${msg.asunto || "Tu consulta"}`}>
                        Responder por email
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-xl border-zinc-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => eliminar(msg.id)}
                      disabled={actionId === msg.id}
                    >
                      {actionId === msg.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 py-24 text-center">
          <Inbox className="mb-4 h-12 w-12 text-zinc-300" />
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            No hay mensajes todavía
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Cuando alguien complete el formulario de contacto, aparecerá acá.
          </p>
        </div>
      )}
    </div>
  );
}