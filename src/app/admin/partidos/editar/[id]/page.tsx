"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Deporte = "Rugby" | "Hockey";

type FormState = {
  equipo_local: string;
  equipo_visitante: string;
  resultado_local: string | number;
  resultado_visitante: string | number;
  fecha_dia: string;
  horario: string;
  cancha: string;
  deporte: Deporte;
  es_proximo: boolean;
};

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLocalTime(date: Date) {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function EditarPartidoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const supabase = useMemo(() => createClient(), []);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState<FormState>({
    equipo_local: "",
    equipo_visitante: "",
    resultado_local: "",
    resultado_visitante: "",
    fecha_dia: "",
    horario: "",
    cancha: "",
    deporte: "Rugby",
    es_proximo: false,
  });

  const huazihulEsLocal = (form.equipo_local ?? "")
    .toUpperCase()
    .includes("HUAZIHUL");
  const huazihulEsVisita = (form.equipo_visitante ?? "")
    .toUpperCase()
    .includes("HUAZIHUL");

  useEffect(() => {
    const fetchPartido = async () => {
      if (!id) return;

      setIsLoading(true);
      setErrorMsg("");

      const idNumerico = Number(id);

      if (Number.isNaN(idNumerico)) {
        setErrorMsg("ID de partido inválido.");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("partidos")
        .select(
          "id, equipo_local, equipo_visitante, resultado_local, resultado_visitante, fecha_programada, cancha, deporte, es_proximo"
        )
        .eq("id", idNumerico)
        .single();

      if (error || !data) {
        setErrorMsg("No se pudo cargar el partido.");
        setIsLoading(false);
        return;
      }

      const fecha = data.fecha_programada ? new Date(data.fecha_programada) : null;

      setForm({
        equipo_local: data.equipo_local ?? "",
        equipo_visitante: data.equipo_visitante ?? "",
        resultado_local: data.resultado_local ?? "",
        resultado_visitante: data.resultado_visitante ?? "",
        fecha_dia: fecha ? formatLocalDate(fecha) : "",
        horario: fecha ? formatLocalTime(fecha) : "",
        cancha: data.cancha ?? "",
        deporte: (data.deporte as Deporte) || "Rugby",
        es_proximo: Boolean(data.es_proximo),
      });

      setIsLoading(false);
    };

    fetchPartido();
  }, [id, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const idNumerico = Number(id);

    if (Number.isNaN(idNumerico)) {
      setErrorMsg("ID de partido inválido.");
      return;
    }

    if (!form.equipo_local.trim() || !form.equipo_visitante.trim()) {
      setErrorMsg("Completá los nombres de ambos equipos.");
      return;
    }

    if ((form.fecha_dia && !form.horario) || (!form.fecha_dia && form.horario)) {
      setErrorMsg("Completá fecha y horario juntos.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    try {
      const updatePayload: {
        equipo_local: string;
        equipo_visitante: string;
        resultado_local: number | null;
        resultado_visitante: number | null;
        cancha: string;
        deporte: string;
        es_proximo: boolean;
        fecha_programada?: string;
      } = {
        equipo_local: form.equipo_local.trim().toUpperCase(),
        equipo_visitante: form.equipo_visitante.trim().toUpperCase(),
        resultado_local:
          form.resultado_local === "" ? null : Number(form.resultado_local),
        resultado_visitante:
          form.resultado_visitante === "" ? null : Number(form.resultado_visitante),
        cancha: form.cancha.trim(),
        deporte: form.deporte,
        es_proximo: form.es_proximo,
      };

      if (form.fecha_dia && form.horario) {
        const fechaReal = new Date(`${form.fecha_dia}T${form.horario}:00`);
        updatePayload.fecha_programada = fechaReal.toISOString();
      }

      if (form.es_proximo) {
        await supabase
          .from("partidos")
          .update({ es_proximo: false })
          .eq("es_proximo", true)
          .neq("id", idNumerico);
      }

      const { error } = await supabase
        .from("partidos")
        .update(updatePayload)
        .eq("id", idNumerico);

      if (error) throw error;

      router.push("/admin/partidos");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || "Error al actualizar el partido.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 px-4 pb-20">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/partidos"
          className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm transition-colors hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4 text-zinc-600" />
        </Link>

        <h1 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">
          Editar / <span className="text-red-600">Cerrar Partido</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="overflow-hidden border-none shadow-xl shadow-zinc-200/50">
          <CardContent className="space-y-10 p-6 md:p-10">
            {/* DISCIPLINA */}
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Disciplina / Deporte
              </Label>

              <div className="flex gap-4">
                {(["Rugby", "Hockey"] as Deporte[]).map((dep) => (
                  <button
                    key={dep}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, deporte: dep }))}
                    className={`flex-1 rounded-2xl border-2 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                      form.deporte === dep
                        ? "border-red-600 bg-red-50 text-red-600 shadow-md shadow-red-600/10"
                        : "border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200"
                    }`}
                  >
                    {dep}
                  </button>
                ))}
              </div>
            </div>

            {/* MARCADOR */}
            <div className="rounded-[2.5rem] border border-white/5 bg-zinc-950 p-8 text-white shadow-2xl shadow-red-900/10 md:p-10">
              <div className="flex items-center justify-center gap-6 md:gap-16">
                <div className="flex-1 space-y-4 text-center">
                  <span
                    className={`block truncate text-[10px] font-black uppercase tracking-[0.2em] ${
                      huazihulEsLocal ? "text-red-500" : "text-zinc-500"
                    }`}
                  >
                    {form.equipo_local || "Local"}
                  </span>

                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="h-20 rounded-3xl border-white/10 bg-white/5 text-center text-4xl font-black text-white transition-all focus:border-red-600 focus:ring-red-600 md:h-24 md:text-5xl"
                    value={form.resultado_local}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        resultado_local: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="text-2xl font-black italic text-zinc-800">VS</div>

                <div className="flex-1 space-y-4 text-center">
                  <span
                    className={`block truncate text-[10px] font-black uppercase tracking-[0.2em] ${
                      huazihulEsVisita ? "text-red-500" : "text-zinc-500"
                    }`}
                  >
                    {form.equipo_visitante || "Visita"}
                  </span>

                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="h-20 rounded-3xl border-white/10 bg-white/5 text-center text-4xl font-black text-white transition-all focus:border-red-600 focus:ring-red-600 md:h-24 md:text-5xl"
                    value={form.resultado_visitante}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        resultado_visitante: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* EQUIPOS */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <Label
                  htmlFor="equipo_local"
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                >
                  Nombre Local
                </Label>
                <Input
                  id="equipo_local"
                  value={form.equipo_local}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      equipo_local: e.target.value.toUpperCase(),
                    }))
                  }
                  className="h-12 rounded-xl border-zinc-200 focus:ring-red-600"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="equipo_visitante"
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                >
                  Nombre Visitante
                </Label>
                <Input
                  id="equipo_visitante"
                  value={form.equipo_visitante}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      equipo_visitante: e.target.value.toUpperCase(),
                    }))
                  }
                  className="h-12 rounded-xl border-zinc-200 focus:ring-red-600"
                />
              </div>
            </div>

            {/* FECHA Y LUGAR */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <CalendarIcon className="h-3 w-3 text-red-600" />
                  Fecha
                </Label>
                <Input
                  type="date"
                  value={form.fecha_dia}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, fecha_dia: e.target.value }))
                  }
                  className="h-12 rounded-xl border-zinc-200"
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <Clock className="h-3 w-3 text-red-600" />
                  Horario
                </Label>
                <Input
                  type="time"
                  value={form.horario}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, horario: e.target.value }))
                  }
                  className="h-12 rounded-xl border-zinc-200"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="cancha"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
              >
                Cancha / Lugar
              </Label>
              <Input
                id="cancha"
                value={form.cancha}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, cancha: e.target.value }))
                }
                className="h-12 rounded-xl border-zinc-200"
              />
            </div>

            {/* STATUS */}
            <label className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-5 transition-colors hover:bg-zinc-100">
              <input
                type="checkbox"
                className="h-6 w-6 rounded-lg accent-red-600 transition-transform group-active:scale-90"
                checked={form.es_proximo}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, es_proximo: e.target.checked }))
                }
              />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-900">
                  Destacar como Próximo Partido
                </span>
                <span className="text-[10px] font-medium text-zinc-500">
                  Forzar aparición en el ticker de la página principal.
                </span>
              </div>
            </label>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-[1.5rem] bg-red-600 py-8 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-red-600/20 transition-all hover:bg-red-700 active:scale-[0.98]"
            >
              {isSaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Guardar Cambios
                </>
              )}
            </Button>

            {errorMsg && (
              <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-center text-xs font-bold text-red-600">
                {errorMsg}
              </p>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}