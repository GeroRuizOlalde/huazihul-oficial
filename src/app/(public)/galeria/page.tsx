import { Instagram } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabasePublic } from "@/lib/supabase/public";
import { SubirFoto } from "@/components/galeria/FotoUploader";
import { GaleriaGrid } from "@/components/galeria/GaleriaGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galería | Huazihul",
  description: "La mística visual del Club Huazihul en fotos.",
};

export default async function GaleriaPage() {
  const { data: fotos, error } = await supabasePublic
    .from("galeria")
    .select("id, url, descripcion, etiqueta, nombre_socio, aprobado, creado_en")
    .eq("aprobado", true)
    .order("creado_en", { ascending: false });

  if (error) console.error("Error cargando galería:", error);

  const galeria = fotos ?? [];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      {/* HEADER */}
      <section className="relative overflow-hidden border-b-8 border-red-600 bg-zinc-950 py-24 text-white">
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <Badge className="mb-6 rounded-none border-none bg-red-600 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white">
            Mística Visual
          </Badge>

          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <h1 className="text-6xl font-black uppercase italic leading-[0.8] tracking-tighter md:text-8xl">
              Galería <br /> <span className="text-red-600">Huazihul</span>
            </h1>
            <SubirFoto />
          </div>
        </div>
      </section>

      {/* GRILLA CON LIGHTBOX */}
      <section className="py-12 md:py-14">
        <GaleriaGrid fotos={galeria} />
      </section>

      {/* FOOTER INSTAGRAM */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 text-center">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <Instagram className="mx-auto mb-6 h-12 w-12 text-red-600" />
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter text-zinc-900">
            Seguí el día a día
          </h2>
          <a
            href="https://www.instagram.com/clubhuazihul/"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-zinc-950 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-600"
          >
            @clubhuazihul
          </a>
        </div>
      </section>
    </div>
  );
}