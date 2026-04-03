import { Users } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import { SociosTable } from "./SociosTable";

export const dynamic = "force-dynamic";

export default async function AdminSociosPage() {
  const supabase = await createClient();

  const { data: aspirantes, error } = await supabase
    .from("socios_aspirantes")
    .select("*")
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error de Supabase:", error.message);
  }

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 font-sans duration-500">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-black uppercase tracking-tighter text-zinc-900">
            Gestion de <span className="text-red-600">Aspirantes</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white px-6 py-3 shadow-sm">
          <Users className="h-5 w-5 text-red-600" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-600">
            Total: {aspirantes?.length || 0}
          </span>
        </div>
      </div>

      <SociosTable initialData={aspirantes || []} />
    </div>
  );
}
