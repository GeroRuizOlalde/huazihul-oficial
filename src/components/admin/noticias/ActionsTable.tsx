"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, ExternalLink, Search, Loader2, AlertTriangle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Noticia {
  id: number;
  titulo: string;
  etiqueta: string;
  creado_en: string;
}

interface ActionsTableProps {
  initialNoticias: Noticia[];
}

export function ActionsTable({ initialNoticias }: ActionsTableProps) {
  const router = useRouter();
  const supabase = createClient();
  const [noticias, setNoticias] = useState<Noticia[]>(initialNoticias);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Filtrado dinámico por búsqueda
  const filteredNoticias = noticias.filter(noticia =>
    noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para ELIMINAR una noticia
  const handleDelete = async (noticiaId: number, titulo: string) => {
    // 1. Confirmación de seguridad
    if (!window.confirm(`¿Estás seguro de que querés eliminar la noticia "${titulo}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsDeleting(noticiaId);

    try {
      // 2. Ejecutar el borrado en Supabase
      const { error } = await supabase
        .from('noticias')
        .delete()
        .eq('id', noticiaId);

      if (error) throw error;

      // 3. Actualizar el estado local (para no tener que recargar la página)
      setNoticias(prev => prev.filter(n => n.id !== noticiaId));
      
      router.refresh(); // Opcional: para refrescar el caché del servidor

    } catch (error: any) {
      alert(`Error al eliminar: ${error.message || 'Ocurrió un error inesperado.'}`);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-1">
            Gestor de <span className="text-red-600">Noticias</span>
          </h1>
          <p className="text-sm font-light text-zinc-500">
            Administrá las publicaciones, crónicas y comunicados del club.
          </p>
        </div>
        
        <Link 
          href="/admin/noticias/crear" 
          className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-sm shadow-red-600/20"
        >
          Redactar Noticia
        </Link>
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder="Buscar por título..." 
            className="pl-10 bg-zinc-50 border-none rounded-xl focus-visible:ring-red-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Total: {filteredNoticias.length} publicaciones
        </div>
      </div>

      {/* TABLA DE DATOS */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Título</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Categoría</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Fecha</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredNoticias.length > 0 ? (
                filteredNoticias.map((noticia) => (
                  <tr key={noticia.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="font-bold text-sm text-zinc-900 line-clamp-1">{noticia.titulo}</p>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className="bg-zinc-100 text-zinc-600 border-none uppercase tracking-widest text-[9px] font-bold">
                        {noticia.etiqueta}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-xs text-zinc-500 font-medium">
                      {new Date(noticia.creado_en).toLocaleDateString('es-AR')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 transition-opacity opacity-100 group-hover:opacity-100">
                        <Link 
                          href={`/noticias/${noticia.id}`} 
                          target="_blank"
                          className="p-2 text-zinc-400 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg shadow-sm hover:shadow transition-all"
                          title="Ver en la web"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        
                        {/* BOTÓN DE EDITAR (Nos lleva a una nueva ruta) */}
                        <Link 
                          href={`/admin/noticias/editar/${noticia.id}`}
                          className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 bg-white border border-zinc-200 rounded-lg shadow-sm hover:shadow transition-all"
                          title="Editar noticia"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        
                        {/* BOTÓN DE ELIMINAR (Maneja el borrado) */}
                        <button 
                          onClick={() => handleDelete(noticia.id, noticia.titulo)}
                          disabled={isDeleting === noticia.id}
                          className="p-2 text-red-600 hover:text-white hover:bg-red-600 bg-white border border-zinc-200 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
                          title="Eliminar noticia"
                        >
                          {isDeleting === noticia.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-zinc-400 text-sm font-medium">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <FileText className="h-10 w-10 text-zinc-300" />
                      <p>No se encontraron noticias con ese criterio.</p>
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