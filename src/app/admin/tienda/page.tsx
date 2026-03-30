"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabasePublic } from "@/lib/supabase/public"; // Para leer la lista
import { subirProducto, eliminarProductoAction } from "./actions"; // Importamos las acciones del servidor
import { cn } from "@/lib/utils";

// Definimos el tipo de dato para TypeScript
type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: string;
  en_stock: boolean;
};

export default function AdminTienda() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("Rugby");
  const [imagen, setImagen] = useState<File | null>(null);

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      // Usamos el cliente público para leer, ya que tiene permisos de SELECT
      const { data, error } = await supabasePublic
        .from("productos")
        .select("*")
        .order("creado_en", { ascending: false });

      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !precio || !imagen) return alert("Faltan datos obligatorios");
    
    setSubiendo(true);

    try {
      // Preparamos los datos para la Server Action
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("categoria", categoria);
      formData.append("imagen", imagen);

      // LLAMADA A LA ACCIÓN DEL SERVIDOR (Seguro y con permisos Admin)
      await subirProducto(formData);

      // Limpiar formulario y recargar lista
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setImagen(null);
      fetchProductos();
      alert("¡Producto publicado con éxito en la boutique!");

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el producto.");
    } finally {
      setSubiendo(false);
    }
  };

  const handleEliminar = async (id: string, imagen_url: string) => {
    if (!confirm("¿Seguro que querés eliminar esta prenda de la tienda?")) return;

    try {
      // LLAMADA A LA ACCIÓN DEL SERVIDOR PARA ELIMINAR
      await eliminarProductoAction(id, imagen_url);
      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 bg-white min-h-screen">
      
      {/* HEADER DE GESTIÓN */}
      <div className="flex flex-col gap-2 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-3 mb-2">
           <ShoppingBag className="w-5 h-5 text-red-600" />
           <span className="text-red-600 font-black uppercase tracking-[0.3em] text-[10px]">
             Panel de Control
           </span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-zinc-950">
          Gestión Boutique<span className="text-red-600">.</span>
        </h1>
        <p className="text-zinc-500 font-medium max-w-2xl">
          Administrá el stock de la tienda oficial del Huazi. Los cambios se reflejan al instante en la web pública.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* COLUMNA 1: FORMULARIO DE CARGA */}
        <div className="lg:col-span-1 h-fit sticky top-24">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-950 mb-8 flex items-center gap-2">
            <Plus className="w-4 h-4 text-red-600" /> Nuevo Ingreso
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Nombre *</label>
                <input 
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-zinc-50 border-none rounded-none p-4 text-sm focus:ring-1 focus:ring-red-600 transition-all font-medium uppercase italic tracking-tight"
                  placeholder="Ej: Camiseta Titular 2026"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Precio ($) *</label>
                  <input 
                    type="number" 
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="w-full bg-zinc-50 border-none rounded-none p-4 text-sm focus:ring-1 focus:ring-red-600 transition-all font-bold"
                    placeholder="45000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Categoría *</label>
                  <select 
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full bg-zinc-50 border-none rounded-none p-4 text-sm focus:ring-1 focus:ring-red-600 transition-all font-bold uppercase tracking-tighter"
                  >
                    <option value="Rugby">Rugby</option>
                    <option value="Hockey">Hockey</option>
                    <option value="Merchandising">Merchandising</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Descripción</label>
                <textarea 
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full bg-zinc-50 border-none rounded-none p-4 text-sm focus:ring-1 focus:ring-red-600 transition-all resize-none h-24"
                  placeholder="Detalles de tela, talles, etc."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Fotografía del Producto *</label>
                <div className="relative border-2 border-dashed border-zinc-200 rounded-none p-10 flex flex-col items-center justify-center hover:bg-zinc-50 hover:border-red-600 transition-all group cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImagen(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <ImageIcon className="w-8 h-8 text-zinc-300 group-hover:text-red-600 mb-3 transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
                    {imagen ? imagen.name : "Subir Archivo"}
                  </span>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={subiendo}
              className="w-full bg-zinc-950 text-white hover:bg-red-600 rounded-none h-14 font-black uppercase tracking-[0.2em] text-[10px] transition-all"
            >
              {subiendo ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar Publicación"}
            </Button>
          </form>
        </div>

        {/* COLUMNA 2: LISTADO DE PRODUCTOS (VISTA PREVIA) */}
        <div className="lg:col-span-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-8">Productos en línea</h2>
          
          {cargando ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : productos.length === 0 ? (
            <div className="bg-zinc-50 rounded-none p-20 text-center flex flex-col items-center border border-zinc-100">
              <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">No hay stock cargado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {productos.map((producto) => (
                <div key={producto.id} className="group relative bg-white border border-zinc-100 p-4 transition-all hover:border-zinc-300">
                  
                  {/* IMAGEN Y ACCIÓN DE BORRAR */}
                  <div className="relative aspect-square bg-zinc-50 overflow-hidden mb-4">
                    <img 
                      src={producto.imagen_url} 
                      alt={producto.nombre} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button 
                      onClick={() => handleEliminar(producto.id, producto.imagen_url)}
                      className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur shadow-sm text-zinc-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* INFO BREVE */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-sm uppercase italic tracking-tighter text-zinc-950 truncate pr-4">
                        {producto.nombre}
                      </h3>
                      <span className="font-bold text-zinc-900 text-sm">
                        ${producto.precio.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest">
                      {producto.categoria}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}