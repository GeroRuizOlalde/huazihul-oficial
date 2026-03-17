import { createClient } from "@/lib/supabase/server"; 
import { SociosTable } from "./SociosTable";
import { Users } from "lucide-react"; // <--- IMPORT CORREGIDO

// Esto asegura que cada vez que entres, busque datos nuevos
export const dynamic = 'force-dynamic';

export default async function AdminSociosPage() {
  const supabase = await createClient();

  const { data: aspirantes, error } = await supabase
    .from('socios_aspirantes')
    .select('*')
    .order('creado_en', { ascending: false });

  if (error) {
    console.error("❌ Error de Supabase:", error.message);
  } else {
    // Este log ahora solo debería salir en tu terminal de VS Code
    console.log("✅ Aspirantes recuperados:", aspirantes?.length || 0);
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-1">
            Gestión de <span className="text-red-600">Aspirantes</span>
          </h1>
        </div>
        <div className="bg-white border border-zinc-100 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
          <Users className="text-red-600 w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-600">
            Total: {aspirantes?.length || 0}
          </span>
        </div>
      </div>

      <SociosTable initialData={aspirantes || []} />
    </div>
  );
}