"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Loader2, Plus, ArrowRight } from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public";
import { cn } from "@/lib/utils";

type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  en_stock: boolean;
};

const WHATSAPP_CLUB = "5492640000000"; 

export default function TiendaPremium() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data, error } = await supabasePublic
          .from("productos")
          .select("*")
          .eq("en_stock", true)
          .order("creado_en", { ascending: false });
        if (error) throw error;
        setProductos(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchProductos();
  }, []);

  const categorias = ["Todos", "Rugby", "Hockey", "Merchandising", "Accesorios"];
  const filtrados = filtro === "Todos" ? productos : productos.filter(p => p.categoria === filtro);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      
      {/* 1. NAVBAR DE TIENDA (SUBTLE) */}
      <div className="pt-32 pb-12 px-6 border-b border-zinc-100">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-4">
                Boutique<span className="text-red-600">.</span>
              </h1>
              <p className="text-zinc-500 font-medium tracking-tight uppercase text-xs">
                Indumentaria oficial de alto rendimiento — San Juan, Argentina
              </p>
            </div>
            
            {/* FILTROS ESTILO STADE TOULOUSAIN */}
            <nav className="flex flex-wrap gap-x-8 gap-y-4">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFiltro(cat)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] transition-colors relative pb-2",
                    filtro === cat ? "text-red-600" : "text-zinc-400 hover:text-zinc-900"
                  )}
                >
                  {cat}
                  {filtro === cat && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 animate-in fade-in zoom-in duration-300" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-16">
        {cargando ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : (
          /* 2. GRILLA LIMPIA */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {filtrados.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                
                {/* IMAGEN: Sin bordes, fondo neutro, zoom suave */}
                <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden mb-6">
                  <img 
                    src={item.imagen_url} 
                    alt={item.nombre}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* ACCIÓN RÁPIDA (Solo aparece en Desktop al hacer hover) */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <button 
                      onClick={() => {
                        const msg = `Hola! Quiero consultar por: ${item.nombre}`;
                        window.open(`https://wa.me/${WHATSAPP_CLUB}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="w-full bg-white text-zinc-900 py-4 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl"
                    >
                      Consultar disponibilidad <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* INFO: Tipografía muy cuidada */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black uppercase italic tracking-tighter leading-tight group-hover:text-red-600 transition-colors">
                      {item.nombre}
                    </h3>
                    <span className="text-lg font-bold text-zinc-900 tabular-nums">
                      ${item.precio.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {item.categoria}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER DE TIENDA */}
      <div className="border-t border-zinc-100 py-20 px-6 bg-zinc-50">
        <div className="container mx-auto max-w-7xl flex flex-col items-center text-center">
          <ShoppingBag className="w-12 h-12 text-zinc-200 mb-6" />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">¿No encontrás lo que buscás?</h2>
          <p className="text-zinc-500 text-sm max-w-md mb-8 font-medium">
            Si necesitás talles especiales o pedidos para equipos completos, ponete en contacto con la secretaría del club.
          </p>
          <a 
            href={`https://wa.me/${WHATSAPP_CLUB}`}
            className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] hover:text-red-600 transition-colors"
          >
            Atención al socio <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}