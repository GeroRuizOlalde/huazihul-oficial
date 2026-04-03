import { TiendaCatalogo } from "@/components/tienda/TiendaCatalogo";
import { isProductoDisponible, type Producto } from "@/lib/tienda";
import { supabasePublic } from "@/lib/supabase/public";

export const revalidate = 60;

export const metadata = {
  title: "Boutique Oficial | Huazihul",
  description:
    "Indumentaria oficial del Club Huazihul. Consulta stock y coordina tu compra por WhatsApp.",
};

const WHATSAPP_CLUB = "5492645771409";

export default async function TiendaPage() {
  const { data, error } = await supabasePublic
    .from("productos")
    .select("*")
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error cargando productos:", error);
  }

  const productos = ((data ?? []) as Producto[]).filter(isProductoDisponible);

  return <TiendaCatalogo productos={productos} whatsappNumber={WHATSAPP_CLUB} />;
}
