"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MessageCircle,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Aspirante = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  deporte_interes: string;
};

export function SociosTable({ initialData }: { initialData: Aspirante[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroDeporte, setFiltroDeporte] = useState("Todos");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const filtrados = initialData.filter((item) => {
    const nombreCompleto = `${item.nombre} ${item.apellido}`.toLowerCase();
    const matchesSearch =
      nombreCompleto.includes(busqueda.toLowerCase()) ||
      String(item.dni).includes(busqueda);
    const matchesSport =
      filtroDeporte === "Todos" || item.deporte_interes === filtroDeporte;

    return matchesSearch && matchesSport;
  });

  const abrirWhatsApp = (telefono: string, nombre: string) => {
    const numLimpio = telefono.replace(/\s+/g, "").replace(/-/g, "");
    const mensaje = encodeURIComponent(
      `Hola ${nombre}, te escribimos desde el Club Huazihul por tu solicitud de socio. Como estas?`
    );

    window.open(`https://wa.me/${numLimpio}?text=${mensaje}`, "_blank");
  };

  const borrarAspirante = async (id: number) => {
    if (!confirm("Estas seguro de eliminar este aspirante?")) {
      return;
    }

    setIsDeleting(id);
    const { error } = await supabase
      .from("socios_aspirantes")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`Error al borrar: ${error.message}`);
    } else {
      router.refresh();
    }

    setIsDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-zinc-100 bg-white p-4 shadow-sm lg:flex-row">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Buscar por nombre o DNI..."
            className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 pl-12"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>

        <div className="scrollbar-hide flex w-full gap-2 overflow-x-auto pb-2 lg:w-auto lg:pb-0">
          {["Todos", "Rugby", "Hockey", "Solo Social"].map((opc) => (
            <button
              key={opc}
              onClick={() => setFiltroDeporte(opc)}
              className={`whitespace-nowrap rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                filtroDeporte === opc
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                  : "border border-zinc-100 bg-white text-zinc-400 hover:border-zinc-200"
              }`}
            >
              {opc}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Postulante
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Documento / Edad
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Interes
                </th>
                <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtrados.length > 0 ? (
                filtrados.map((item) => (
                  <tr
                    key={item.id}
                    className="group transition-colors hover:bg-zinc-50/50"
                  >
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-base font-black uppercase tracking-tight text-zinc-900">
                          {item.nombre} {item.apellido}
                        </span>
                        <span className="text-xs font-light text-zinc-400">
                          {item.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col text-xs font-bold text-zinc-600">
                        <span className="flex items-center gap-1">
                          <UserPlus className="h-3 w-3 text-red-600" />
                          DNI {item.dni}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                          <Calendar className="h-3 w-3" />
                          {item.fecha_nacimiento}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge
                        className={
                          item.deporte_interes === "Rugby"
                            ? "border-red-100 bg-red-50 text-red-600"
                            : item.deporte_interes === "Hockey"
                              ? "border-blue-100 bg-blue-50 text-blue-600"
                              : "border-zinc-200 bg-zinc-100 text-zinc-500"
                        }
                      >
                        {item.deporte_interes}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          className="h-10 gap-2 rounded-xl border-green-200 bg-green-50 px-4 text-green-700 transition-all hover:bg-green-600 hover:text-white"
                          onClick={() => abrirWhatsApp(item.telefono, item.nombre)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="hidden text-[10px] font-black uppercase tracking-tighter sm:inline">
                            WhatsApp
                          </span>
                        </Button>

                        <Button
                          variant="outline"
                          disabled={isDeleting === item.id}
                          className="h-10 w-10 rounded-xl border-zinc-100 text-zinc-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                          onClick={() => borrarAspirante(item.id)}
                        >
                          <Trash2
                            className={`h-4 w-4 ${isDeleting === item.id ? "animate-spin" : ""}`}
                          />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="h-10 w-10 text-zinc-100" />
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-300">
                        Sin registros para esta busqueda
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
