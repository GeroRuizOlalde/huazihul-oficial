import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contacto/ContactForm";

export default function ContactoPage() {
  const GOOGLE_MAPS_EMBED_URL =
    "https://www.google.com/maps?q=Huazihul%20San%20Juan%20Rugby%20Club&output=embed";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white">
      {/* BLOQUE SUPERIOR: INFO + FORMULARIO */}
      <div className="grid lg:grid-cols-2">
        {/* COLUMNA INFO */}
        <div className="flex flex-col justify-center border-b-8 border-r-0 border-red-600 bg-zinc-950 p-12 text-white md:p-24 lg:border-b-0 lg:border-r-8">
          <h1 className="mb-10 text-6xl font-black uppercase italic tracking-tighter md:text-8xl">
            Hablemos
          </h1>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-6 w-6 shrink-0 text-red-600" />
              <div>
                <h4 className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Ubicación
                </h4>
                <p className="text-lg font-bold italic">
                  Sgto. Cabral Oeste 5400, Rivadavia, San Juan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="mt-1 h-6 w-6 shrink-0 text-red-600" />
              <div>
                <h4 className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Teléfono Secretaría
                </h4>
                <p className="text-lg font-bold">+54 264 577 1409</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="mt-1 h-6 w-6 shrink-0 text-red-600" />
              <div>
                <h4 className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Atención
                </h4>
                <p className="text-lg font-bold italic">
                  Lunes a Viernes de 16:00 a 21:00 hs.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Button
              className="!bg-[#25D366] hover:!bg-[#128C7E] w-full rounded-none border-none px-8 py-7 font-black uppercase tracking-widest text-white shadow-xl shadow-green-900/20 transition-all hover:scale-105 md:w-auto"
              asChild
            >
              <a
                href="https://wa.me/5492645771409"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3"
              >
                <MessageCircle className="h-6 w-6 fill-white/20" />
                Consultar por WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* COLUMNA FORMULARIO */}
        <div className="flex flex-col justify-center bg-zinc-950 p-12 md:p-24">
          <div className="mb-8">
            <div className="mb-2 h-1 w-10 bg-red-600" />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white md:text-4xl">
              Envianos un mensaje
            </h2>
            <p className="mt-2 text-sm font-light text-zinc-500">
              Te responderemos lo antes posible.
            </p>
          </div>

          <ContactForm />
        </div>
      </div>

      {/* BLOQUE INFERIOR: MAPA */}
      <div className="relative h-[400px] w-full overflow-hidden bg-zinc-200 lg:h-[500px]">
        <iframe
          src={GOOGLE_MAPS_EMBED_URL}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación Huazihul San Juan Rugby Club"
        />
      </div>
    </div>
  );
}