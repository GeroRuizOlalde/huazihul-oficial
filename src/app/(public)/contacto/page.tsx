import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactoPage() {
  const GOOGLE_MAPS_EMBED_URL =
    "https://www.google.com/maps?q=Huazihul%20San%20Juan%20Rugby%20Club&output=embed";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* COLUMNA INFO */}
        <div className="bg-zinc-950 text-white p-12 md:p-24 flex flex-col justify-center border-b-8 lg:border-b-0 lg:border-r-8 border-red-600">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic mb-8">
            Hablemos
          </h1>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <MapPin className="text-red-600 w-6 h-6 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs text-zinc-500 mb-1">
                  Ubicación
                </h4>
                <p className="font-bold text-lg italic">
                  Sgto. Cabral Oeste 5400, Rivadavia, San Juan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="text-red-600 w-6 h-6 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs text-zinc-500 mb-1">
                  Teléfono Secretaría
                </h4>
                <p className="font-bold text-lg">+54 264 577 1409</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="text-red-600 w-6 h-6 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs text-zinc-500 mb-1">
                  Atención
                </h4>
                <p className="font-bold text-lg italic">
                  Lunes a Viernes de 16:00 a 21:00 hs.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16">
              {/* Usamos !bg-green-600 para forzar el color sobre el componente de shadcn */}
              <Button
                className="!bg-[#25D366] hover:!bg-[#128C7E] text-white rounded-none font-black uppercase tracking-widest px-8 py-7 w-full md:w-auto transition-all hover:scale-105 shadow-xl shadow-green-900/20 border-none"
                asChild
              >
                <a
                  href="https://wa.me/5492645771409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-6 h-6 fill-white/20" />
                  Consultar por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        

        {/* COLUMNA MAPA */}
        <div className="relative bg-zinc-200 min-h-[400px] lg:min-h-[calc(100vh-80px)] overflow-hidden">
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Huazihul San Juan Rugby Club"
          />
        </div>
      </div>
    </div>
  );
}