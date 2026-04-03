"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, FileText, Loader2, Pencil, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";

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

  const filteredNoticias = noticias.filter((noticia) =>
    noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (noticiaId: number, titulo: string) => {
    if (
      !window.confirm(
        `Estas seguro de que quieres eliminar la noticia "${titulo}"? Esta accion no se puede deshacer.`
      )
    ) {
      return;
    }

    setIsDeleting(noticiaId);

    try {
      const { error } = await supabase.from("noticias").delete().eq("id", noticiaId);

      if (error) {
        throw error;
      }

      setNoticias((prev) => prev.filter((noticia) => noticia.id !== noticiaId));
      router.refresh();
    } catch (error: unknown) {
      alert(`Error al eliminar: ${getErrorMessage(error)}`);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-black uppercase tracking-tighter text-zinc-900">
            Gestor de <span className="text-red-600">Noticias</span>
          </h1>
          <p className="text-sm font-light text-zinc-500">
            Administra las publicaciones, cronicas y comunicados del club.
          </p>
        </div>

        <Link
          href="/admin/noticias/crear"
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm shadow-red-600/20 transition-colors hover:bg-red-700"
        >
          Redactar Noticia
        </Link>
      </div>

      <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Buscar por titulo..."
            className="rounded-xl border-none bg-zinc-50 pl-10 focus-visible:ring-red-600"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Total: {filteredNoticias.length} publicaciones
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Titulo
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Categoria
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Fecha
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredNoticias.length > 0 ? (
                filteredNoticias.map((noticia) => (
                  <tr
                    key={noticia.id}
                    className="group transition-colors hover:bg-zinc-50/50"
                  >
                    <td className="px-6 py-4">
                      <p className="line-clamp-1 text-sm font-bold text-zinc-900">
                        {noticia.titulo}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="border-none bg-zinc-100 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                        {noticia.etiqueta}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-zinc-500">
                      {new Date(noticia.creado_en).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/noticias/${noticia.id}`}
                          target="_blank"
                          className="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-400 shadow-sm transition-all hover:text-zinc-900 hover:shadow"
                          title="Ver en la web"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/admin/noticias/editar/${noticia.id}`}
                          className="rounded-lg border border-zinc-200 bg-white p-2 text-blue-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white hover:shadow"
                          title="Editar noticia"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(noticia.id, noticia.titulo)}
                          disabled={isDeleting === noticia.id}
                          className="rounded-lg border border-zinc-200 bg-white p-2 text-red-600 shadow-sm transition-all hover:bg-red-600 hover:text-white hover:shadow disabled:opacity-50"
                          title="Eliminar noticia"
                        >
                          {isDeleting === noticia.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-sm font-medium text-zinc-400">
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
