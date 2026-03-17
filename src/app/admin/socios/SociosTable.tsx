"use client";

import { useState } from "react";
import { 
  Search, 
  MessageCircle, 
  Trash2, 
  UserPlus,
  Clock,
  Calendar, // <--- AGREGADO AQUÍ
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SociosTable({ initialData }: { initialData: any[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroDeporte, setFiltroDeporte] = useState("Todos");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // Filtrado dinámico (Directo de initialData para que esté siempre sincronizado)
  const filtrados = initialData.filter(item => {
    const nombreCompleto = `${item.nombre} ${item.apellido}`.toLowerCase();
    const matchesSearch = nombreCompleto.includes(busqueda.toLowerCase()) || 
                          String(item.dni).includes(busqueda);
    const matchesSport = filtroDeporte === "Todos" || item.deporte_interes === filtroDeporte;
    return matchesSearch && matchesSport;
  });

  const abrirWhatsApp = (telefono: string, nombre: string) => {
    const numLimpio = telefono.replace(/\s+/g, '').replace(/-/g, '');
    const mensaje = encodeURIComponent(`Hola ${nombre}, te escribimos desde el Club Huazihul por tu solicitud de socio. ¿Cómo estás?`);
    window.open(`https://wa.me/${numLimpio}?text=${mensaje}`, '_blank');
  };

  const borrarAspirante = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este aspirante?")) return;
    
    setIsDeleting(id);
    const { error } = await supabase.from('socios_aspirantes').delete().eq('id', id);
    
    if (error) {
      alert("Error al borrar: " + error.message);
    } else {
      router.refresh(); // Refresca los datos del servidor
    }
    setIsDeleting(null);
  };

  return (
    <div className="space-y-6">
      
      {/* BARRA DE HERRAMIENTAS */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder="Buscar por nombre o DNI..." 
            className="pl-12 rounded-2xl border-zinc-100 bg-zinc-50/50 h-12"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {["Todos", "Rugby", "Hockey", "Solo Social"].map((opc) => (
            <button
              key={opc}
              onClick={() => setFiltroDeporte(opc)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filtroDeporte === opc 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                : 'bg-white text-zinc-400 border border-zinc-100 hover:border-zinc-200'
              }`}
            >
              {opc}
            </button>
          ))}
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Postulante</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Documento / Edad</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Interés</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtrados.length > 0 ? filtrados.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-black uppercase tracking-tight text-zinc-900 text-base">{item.nombre} {item.apellido}</span>
                      <span className="text-xs text-zinc-400 font-light">{item.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col text-xs font-bold text-zinc-600">
                      <span className="flex items-center gap-1"><UserPlus className="w-3 h-3 text-red-600"/> DNI {item.dni}</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3"/> {item.fecha_nacimiento}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <Badge className={
                      item.deporte_interes === 'Rugby' ? 'bg-red-50 text-red-600 border-red-100' : 
                      item.deporte_interes === 'Hockey' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      'bg-zinc-100 text-zinc-500 border-zinc-200'
                    }>
                      {item.deporte_interes}
                    </Badge>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        className="rounded-xl border-green-200 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-all gap-2 h-10 px-4"
                        onClick={() => abrirWhatsApp(item.telefono, item.nombre)}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline font-black uppercase tracking-tighter text-[10px]">WhatsApp</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        disabled={isDeleting === item.id}
                        className="rounded-xl border-zinc-100 text-zinc-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600 h-10 w-10 transition-all"
                        onClick={() => borrarAspirante(item.id)}
                      >
                        <Trash2 className={`w-4 h-4 ${isDeleting === item.id ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="w-10 h-10 text-zinc-100" />
                      <p className="text-zinc-300 font-black uppercase tracking-widest text-xs">Sin registros para esta búsqueda</p>
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

