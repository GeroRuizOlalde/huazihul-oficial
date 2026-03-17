import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy, Shield } from "lucide-react";

export default function RugbyPage() {
  const categorias = [
    { nombre: "Infantiles", edades: "M6 a M14", horario: "Mar y Jue 18:30hs" },
    { nombre: "Juveniles", edades: "M15 a M19", horario: "Lun, Mar y Jue 20:00hs" },
    { nombre: "Plantel Superior", edades: "Primera e Intermedia", horario: "Mar y Jue 21:30hs" },
    { nombre: "Veteranos", edades: "Caciques", horario: "Sábados 15:00hs" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* HERO RUGIERRE */}
      <section className="relative h-[60vh] bg-zinc-950 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/rugby-action.jpg')] bg-cover bg-center opacity-40" />
        <div className="container relative z-10 px-6 md:px-8">
          <Badge className="bg-red-600 text-white rounded-none mb-4 uppercase tracking-[0.3em] text-[10px]">Pura Pasión</Badge>
          <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter italic leading-none">
            Rugby <br /> <span className="text-red-600">Huazihul</span>
          </h1>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* LADO IZQUIERDO: TEXTO */}
            <div className="lg:col-span-1 space-y-8">
              <div className="h-1.5 w-16 bg-red-600" />
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none text-zinc-900">
                Formando <br /> Jugadores y <br /> Personas
              </h2>
              <p className="text-zinc-500 font-light leading-relaxed">
                Desde 1927, el rugby en Huazihul es sinónimo de familia. Contamos con todas las categorías, desde los más pequeños que dan sus primeros pasos en el deporte, hasta nuestro Plantel Superior.
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <span className="block text-3xl font-black text-red-600 italic">+500</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Jugadores</span>
                </div>
                <div className="w-[1px] bg-zinc-100" />
                <div className="text-center">
                  <span className="block text-3xl font-black text-red-600 italic">1927</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Fundación</span>
                </div>
              </div>
            </div>

            {/* LADO DERECHO: CATEGORÍAS */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorias.map((cat) => (
                <div key={cat.nombre} className="p-8 border border-zinc-100 bg-zinc-50/50 rounded-3xl hover:bg-white hover:shadow-xl transition-all group">
                  <Shield className="w-8 h-8 text-red-600 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 mb-2">{cat.nombre}</h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      <Users className="w-4 h-4" /> {cat.edades}
                    </p>
                    <p className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      <Clock className="w-4 h-4 text-red-600" /> {cat.horario}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}