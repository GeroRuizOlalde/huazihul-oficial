import { supabasePublic } from "@/lib/supabase/public";
import { ActionsTable } from "@/components/admin/noticias/ActionsTable";
import { FileWarning } from "lucide-react";

export default async function AdminNoticiasPage() {
  // Vamos a buscar las noticias a Supabase desde el Servidor
  const { data: noticias, error } = await supabasePublic
    .from('noticias')
    .select('id, titulo, etiqueta, creado_en')
    .order('creado_en', { ascending: false });

  // Manejo de error de base de datos
  if (error || !noticias) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-zinc-50 px-4 text-center">
        <FileWarning className="mx-auto mb-6 h-16 w-16 text-red-600" />
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-2">
          Error de <span className="text-red-600">Conexión</span>
        </h1>
        <p className="text-sm font-light text-zinc-500 max-w-md">
          Ocurrió un error al intentar cargar el listado de noticias de Riva Estudio. Verificá tu conexión o reintentá más tarde.
        </p>
        <p className="mt-4 text-xs font-mono text-zinc-400 p-3 bg-zinc-100 rounded">
          {error?.message || "Error desconocido."}
        </p>
      </div>
    );
  }

  // Si todo sale bien, le pasamos las noticias al componente cliente
  return (
    <ActionsTable initialNoticias={noticias} />
  );
}