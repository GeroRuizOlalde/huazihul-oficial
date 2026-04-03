import { supabasePublic } from "@/lib/supabase/public";
import { FixtureList } from "./FixtureList";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60;

export default async function FixturePage() {
  const { data: partidos } = await supabasePublic
    .from('partidos')
    .select('*')
    .order('fecha_programada', { ascending: true });

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white pb-20">
      <section className="bg-zinc-950 py-24 border-b-8 border-red-600">
        <div className="container px-6 md:px-8">
          <Badge className="bg-red-600 text-white rounded-none mb-4 tracking-[0.3em] uppercase text-[10px] border-none">
            Calendario Oficial
          </Badge>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-white leading-[0.8]">
            Fixture <br /> <span className="text-red-600">Huazihul</span>
          </h1>
        </div>
      </section>

      <section className="py-12 md:py-20 -mt-10 md:-mt-14 relative z-10">
        <div className="container px-6 md:px-8">
          {partidos && <FixtureList partidos={partidos} />}
        </div>
      </section>
    </div>
  );
}
