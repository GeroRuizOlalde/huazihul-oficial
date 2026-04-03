import { FileWarning } from "lucide-react";

import { ActionsTable } from "@/components/admin/noticias/ActionsTable";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminNoticiasPage() {
  const supabase = await createClient();

  const { data: noticias, error } = await supabase
    .from("noticias")
    .select("id, titulo, etiqueta, creado_en")
    .order("creado_en", { ascending: false });

  if (error || !noticias) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-zinc-50 px-4 text-center">
        <FileWarning className="mx-auto mb-6 h-16 w-16 text-red-600" />

        <h1 className="mb-2 text-3xl font-black uppercase tracking-tighter text-zinc-900">
          Error de <span className="text-red-600">Conexion</span>
        </h1>

        <p className="max-w-md text-sm font-light text-zinc-500">
          Ocurrio un error al intentar cargar el listado de noticias de
          Huazihul. Verifica tu conexion o reintenta mas tarde.
        </p>

        <p className="mt-4 rounded bg-zinc-100 p-3 font-mono text-xs text-zinc-400">
          {error?.message || "Error desconocido."}
        </p>
      </div>
    );
  }

  return <ActionsTable initialNoticias={noticias} />;
}
