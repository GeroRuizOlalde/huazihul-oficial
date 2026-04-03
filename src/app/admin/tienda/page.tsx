"use client";

/* eslint-disable @next/next/no-img-element */

import { type FormEvent, useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Search,
  ShoppingBag,
  Tag,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  getProductoPrecio,
  getProductoPrecioPromocional,
  getProductoStock,
  getProductoStockTexto,
  isProductoDisponible,
  type Producto,
} from "@/lib/tienda";
import { supabasePublic } from "@/lib/supabase/public";
import { getErrorMessage } from "@/lib/utils";

import {
  actualizarProductoAction,
  eliminarProductoAction,
  subirProducto,
} from "./actions";

type ProductoDraft = {
  precio: string;
  precioPromocional: string;
  stock: string;
  guardando: boolean;
};

const CATEGORIAS = ["Rugby", "Hockey", "Merchandising", "Accesorios"];

export default function AdminTienda() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [nuevoProductoOpen, setNuevoProductoOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioPromocional, setPrecioPromocional] = useState("");
  const [stock, setStock] = useState("1");
  const [categoria, setCategoria] = useState("Rugby");
  const [imagen, setImagen] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [ediciones, setEdiciones] = useState<Record<string, ProductoDraft>>({});

  const busquedaDiferida = useDeferredValue(busqueda);

  useEffect(() => {
    void fetchProductos();
  }, []);

  const productosFiltrados = useMemo(() => {
    const termino = busquedaDiferida.trim().toLowerCase();

    if (!termino) {
      return productos;
    }

    return productos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino) ||
        producto.descripcion?.toLowerCase().includes(termino)
      );
    });
  }, [busquedaDiferida, productos]);

  const fetchProductos = async () => {
    try {
      const { data, error } = await supabasePublic
        .from("productos")
        .select("*")
        .order("creado_en", { ascending: false });

      if (error) throw error;

      const items = (data || []) as Producto[];
      setProductos(items);
      setEdiciones(createDrafts(items));
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  const resetNuevoProductoForm = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setPrecioPromocional("");
    setStock("1");
    setCategoria("Rugby");
    setImagen(null);
    setFileInputKey((prev) => prev + 1);
  };

  const handleDialogChange = (open: boolean) => {
    setNuevoProductoOpen(open);

    if (!open && !subiendo) {
      resetNuevoProductoForm();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !precio || !imagen) {
      window.alert("Faltan datos obligatorios.");
      return;
    }

    setSubiendo(true);

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("precio_promocional", precioPromocional);
      formData.append("stock", stock);
      formData.append("categoria", categoria);
      formData.append("imagen", imagen);

      await subirProducto(formData);
      await fetchProductos();

      resetNuevoProductoForm();
      setNuevoProductoOpen(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      window.alert(getErrorMessage(error, "Hubo un error al guardar el producto."));
    } finally {
      setSubiendo(false);
    }
  };

  const handleEliminar = async (id: string, imagenUrl: string) => {
    if (!confirm("Seguro que quieres eliminar esta prenda de la tienda?")) {
      return;
    }

    try {
      await eliminarProductoAction(id, imagenUrl);
      await fetchProductos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      window.alert(getErrorMessage(error, "No se pudo eliminar el producto."));
    }
  };

  const handleDraftChange = (
    id: string,
    field: keyof Omit<ProductoDraft, "guardando">,
    value: string
  ) => {
    setEdiciones((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? {
          precio: "",
          precioPromocional: "",
          stock: "0",
          guardando: false,
        }),
        [field]: value,
      },
    }));
  };

  const handleGuardarCambios = async (producto: Producto) => {
    const draft = ediciones[producto.id];

    if (!draft) {
      return;
    }

    const precioValue = Number(draft.precio);
    const stockValue = Number(draft.stock);
    const precioPromocionalValue = draft.precioPromocional.trim()
      ? Number(draft.precioPromocional)
      : null;

    if (!Number.isFinite(precioValue) || precioValue <= 0) {
      window.alert("El precio debe ser mayor a 0.");
      return;
    }

    if (!Number.isFinite(stockValue) || stockValue < 0) {
      window.alert("El stock debe ser 0 o mayor.");
      return;
    }

    if (
      precioPromocionalValue !== null &&
      (!Number.isFinite(precioPromocionalValue) ||
        precioPromocionalValue <= 0 ||
        precioPromocionalValue >= precioValue)
    ) {
      window.alert("El precio promocional debe ser menor al precio normal.");
      return;
    }

    setEdiciones((prev) => ({
      ...prev,
      [producto.id]: {
        ...draft,
        guardando: true,
      },
    }));

    try {
      await actualizarProductoAction({
        id: producto.id,
        precio: precioValue,
        precioPromocional: precioPromocionalValue,
        stock: Math.floor(stockValue),
      });

      await fetchProductos();
    } catch (error) {
      console.error("Error al actualizar:", error);
      window.alert(getErrorMessage(error, "No se pudo actualizar el producto."));
      setEdiciones((prev) => ({
        ...prev,
        [producto.id]: {
          ...draft,
          guardando: false,
        },
      }));
    }
  };

  return (
    <>
      <div className="min-h-screen max-w-7xl mx-auto bg-[#f7f8fb] p-6 md:p-8">
        <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-6 py-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-600">
                    Admin tienda
                  </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
                  Productos
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                  Gestiona todo el catalogo desde una sola vista. Edita stock,
                  precio y promocion sin salir del listado.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setNuevoProductoOpen(true)}
                className="h-12 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo producto
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                  placeholder="Busca por nombre, categoria o descripcion"
                  className="h-12 rounded-xl border-zinc-200 bg-white pl-11 text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                <div className="rounded-full bg-zinc-100 px-4 py-2 font-semibold text-zinc-700">
                  {productos.length} productos
                </div>
                <div className="rounded-full bg-zinc-100 px-4 py-2 font-semibold text-zinc-700">
                  {productosFiltrados.length} visibles en lista
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 md:px-6">
            {cargando ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : productos.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-zinc-200 bg-zinc-50 px-6 py-20 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  No hay productos cargados
                </p>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-zinc-200 bg-zinc-50 px-6 py-20 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  No encontramos productos con esa busqueda
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200">
                <div className="hidden grid-cols-[minmax(0,2.4fr)_120px_140px_140px_180px] gap-4 bg-zinc-50 px-5 py-4 lg:grid">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    Producto
                  </p>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    Stock
                  </p>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    Precio
                  </p>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    Promocional
                  </p>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    Acciones
                  </p>
                </div>

                {productosFiltrados.map((producto, index) => (
                  <div
                    key={producto.id}
                    className={`grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,2.4fr)_120px_140px_140px_180px] lg:items-center ${
                      index !== 0 ? "border-t border-zinc-200" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
                        <img
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-base font-bold text-zinc-950">
                          {producto.nombre}
                        </h2>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                          {producto.categoria}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-700">
                            {getProductoStockTexto(producto)}
                          </span>
                          {getProductoPrecioPromocional(producto) ? (
                            <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-600">
                              Promo activa
                            </span>
                          ) : null}
                          <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-700">
                            {isProductoDisponible(producto) ? "Visible" : "Sin stock"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 lg:hidden">
                        Stock
                      </p>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={ediciones[producto.id]?.stock ?? ""}
                        onChange={(e) =>
                          handleDraftChange(producto.id, "stock", e.target.value)
                        }
                        className="h-11 rounded-xl border-zinc-200 bg-white text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 lg:hidden">
                        Precio
                      </p>
                      <Input
                        type="number"
                        min="1"
                        value={ediciones[producto.id]?.precio ?? ""}
                        onChange={(e) =>
                          handleDraftChange(producto.id, "precio", e.target.value)
                        }
                        className="h-11 rounded-xl border-zinc-200 bg-white text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 lg:hidden">
                        Promocional
                      </p>
                      <Input
                        type="number"
                        min="0"
                        value={ediciones[producto.id]?.precioPromocional ?? ""}
                        onChange={(e) =>
                          handleDraftChange(
                            producto.id,
                            "precioPromocional",
                            e.target.value
                          )
                        }
                        placeholder="Sin promo"
                        className="h-11 rounded-xl border-zinc-200 bg-white text-sm font-semibold"
                      />
                    </div>

                    <div className="flex items-center gap-2 lg:justify-end">
                      <Button
                        type="button"
                        onClick={() => handleGuardarCambios(producto)}
                        disabled={ediciones[producto.id]?.guardando}
                        className="h-11 rounded-xl bg-zinc-950 px-4 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-blue-600"
                      >
                        {ediciones[producto.id]?.guardando ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleEliminar(producto.id, producto.imagen_url)}
                        className="h-11 w-11 rounded-xl border-zinc-200 p-0 text-zinc-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar producto</span>
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-4 text-sm font-medium text-zinc-500">
                  Mostrando {productosFiltrados.length} de {productos.length} productos
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={nuevoProductoOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-none bg-white p-0 shadow-2xl sm:max-w-2xl">
          <DialogHeader className="border-b border-zinc-200 px-8 py-7 text-left">
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Plus className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-zinc-950">
                  Nuevo producto
                </DialogTitle>
                <p className="mt-1 text-sm text-zinc-500">
                  Carga una nueva prenda y publicala con stock y promocion desde el inicio.
                </p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Nombre *
                </label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Camiseta titular 2026"
                  className="h-12 rounded-xl border-zinc-200 bg-white text-sm font-medium"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Precio *
                  </label>
                  <Input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="45000"
                    className="h-12 rounded-xl border-zinc-200 bg-white text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Categoria *
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-950 outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
                  >
                    {CATEGORIAS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Precio promocional
                  </label>
                  <Input
                    type="number"
                    value={precioPromocional}
                    onChange={(e) => setPrecioPromocional(e.target.value)}
                    placeholder="39000"
                    className="h-12 rounded-xl border-zinc-200 bg-white text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Stock *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="12"
                    className="h-12 rounded-xl border-zinc-200 bg-white text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Descripcion
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles de tela, talles, cuidados o notas internas."
                  className="h-28 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Fotografia del producto *
                </label>
                <div className="group relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 transition-colors hover:border-blue-300 hover:bg-blue-50/40">
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImagen(e.target.files?.[0] || null)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    required
                  />
                  <ImageIcon className="mb-3 h-8 w-8 text-zinc-300 transition-colors group-hover:text-blue-600" />
                  <p className="text-center text-sm font-semibold text-zinc-700">
                    {imagen ? imagen.name : "Haz click para subir una imagen"}
                  </p>
                  <p className="mt-1 text-center text-xs text-zinc-500">
                    JPG, PNG o WebP hasta 5 MB
                  </p>
                </div>
              </div>

              <p className="text-[11px] font-medium text-zinc-500">
                Si dejas el precio promocional vacio, el producto se mostrara con
                su precio normal.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                className="h-12 rounded-xl px-5 text-sm font-semibold"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={subiendo}
                className="h-12 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
              >
                {subiendo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Tag className="mr-2 h-4 w-4" />
                    Crear producto
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function createDrafts(productos: Producto[]) {
  return Object.fromEntries(
    productos.map((producto) => [
      producto.id,
      {
        precio: String(getProductoPrecio(producto)),
        precioPromocional: getProductoPrecioPromocional(producto)?.toString() ?? "",
        stock: String(
          getProductoStock(producto) ?? (isProductoDisponible(producto) ? 1 : 0)
        ),
        guardando: false,
      },
    ])
  ) as Record<string, ProductoDraft>;
}
