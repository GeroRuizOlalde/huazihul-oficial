"use client";

/* eslint-disable @next/next/no-img-element */

import {
  type FormEvent,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Image as ImageIcon,
  Loader2,
  PencilLine,
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
import { Label } from "@/components/ui/label";
import {
  getProductoPrecio,
  getProductoPrecioPromocional,
  getProductoStock,
  getProductoStockTexto,
  getProductoTalles,
  isProductoDisponible,
  type Producto,
} from "@/lib/tienda";
import { supabasePublic } from "@/lib/supabase/public";
import { getErrorMessage } from "@/lib/utils";

import {
  actualizarProductoAction,
  editarProductoAction,
  eliminarProductoAction,
  subirProducto,
} from "./actions";

type ProductoDraft = {
  precio: string;
  precioPromocional: string;
  stock: string;
  guardando: boolean;
};

type ProductoFormState = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  precioPromocional: string;
  stock: string;
  categoria: string;
  talles: string[];
  imagen: File | null;
  imagenActualUrl: string;
  fileInputKey: number;
};

type ProductoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ProductoFormState | null;
  updateForm: (updater: (prev: ProductoFormState) => ProductoFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  title: string;
  description: string;
  submitLabel: string;
  submitPending: boolean;
  requireImage: boolean;
};

const CATEGORIAS = ["Rugby", "Hockey", "Merchandising", "Accesorios"];
const TALLES_PREDEFINIDOS = [
  "2",
  "4",
  "6",
  "8",
  "10",
  "12",
  "14",
  "16",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "UNICO",
];

export default function AdminTienda() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [subiendoNuevo, setSubiendoNuevo] = useState(false);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [nuevoProductoOpen, setNuevoProductoOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [nuevoProductoForm, setNuevoProductoForm] =
    useState<ProductoFormState>(createEmptyForm());
  const [productoEnEdicion, setProductoEnEdicion] =
    useState<ProductoFormState | null>(null);
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
        producto.descripcion?.toLowerCase().includes(termino) ||
        getProductoTalles(producto).some((talle) =>
          talle.toLowerCase().includes(termino)
        )
      );
    });
  }, [busquedaDiferida, productos]);

  const faltaMigracionTienda = useMemo(() => {
    if (productos.length === 0) {
      return false;
    }

    return productos.some(
      (producto) =>
        !("stock" in producto) ||
        !("precio_promocional" in producto) ||
        !("talles" in producto)
    );
  }, [productos]);

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

  const handleDialogNuevoChange = (open: boolean) => {
    setNuevoProductoOpen(open);

    if (!open && !subiendoNuevo) {
      setNuevoProductoForm(createEmptyForm());
    }
  };

  const handleDialogEdicionChange = (open: boolean) => {
    if (!open && !guardandoEdicion) {
      setProductoEnEdicion(null);
    }
  };

  const handleCrearProducto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nuevoProductoForm.nombre || !nuevoProductoForm.precio || !nuevoProductoForm.imagen) {
      window.alert("Faltan datos obligatorios.");
      return;
    }

    setSubiendoNuevo(true);

    try {
      const formData = buildProductoFormData(nuevoProductoForm, true);
      const result = await subirProducto(formData);

      if (!result.ok) {
        window.alert(result.error);
        return;
      }

      await fetchProductos();
      setNuevoProductoForm(createEmptyForm());
      setNuevoProductoOpen(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      window.alert(getErrorMessage(error, "Hubo un error al guardar el producto."));
    } finally {
      setSubiendoNuevo(false);
    }
  };

  const handleAbrirEdicion = (producto: Producto) => {
    setProductoEnEdicion(buildEditForm(producto));
  };

  const handleEditarProducto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productoEnEdicion) {
      return;
    }

    if (!productoEnEdicion.nombre || !productoEnEdicion.precio) {
      window.alert("Faltan datos obligatorios.");
      return;
    }

    setGuardandoEdicion(true);

    try {
      const formData = buildProductoFormData(productoEnEdicion, false);
      const result = await editarProductoAction(formData);

      if (!result.ok) {
        window.alert(result.error);
        return;
      }

      await fetchProductos();
      setProductoEnEdicion(null);
    } catch (error) {
      console.error("Error al editar:", error);
      window.alert(getErrorMessage(error, "No se pudo editar el producto."));
    } finally {
      setGuardandoEdicion(false);
    }
  };

  const handleEliminar = async (id: string, imagenUrl: string) => {
    if (!confirm("Seguro que quieres eliminar esta prenda de la tienda?")) {
      return;
    }

    try {
      const result = await eliminarProductoAction(id, imagenUrl);

      if (!result.ok) {
        window.alert(result.error);
        return;
      }

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

  const handleGuardarCambiosRapidos = async (producto: Producto) => {
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
      const result = await actualizarProductoAction({
        id: producto.id,
        precio: precioValue,
        precioPromocional: precioPromocionalValue,
        stock: Math.floor(stockValue),
      });

      if (!result.ok) {
        window.alert(result.error);
        setEdiciones((prev) => ({
          ...prev,
          [producto.id]: {
            ...draft,
            guardando: false,
          },
        }));
        return;
      }

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
                  precio, promo y abre el detalle para tocar talles y datos
                  completos.
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
                  placeholder="Busca por nombre, categoria, descripcion o talle"
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

            {faltaMigracionTienda ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                La tabla `productos` todavia no tiene las columnas `stock`,
                `precio_promocional` y/o `talles`. Mientras no ejecutes las
                migraciones SQL de tienda, crear o editar productos va a fallar.
              </div>
            ) : null}
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
                <div className="hidden grid-cols-[minmax(0,2.8fr)_120px_140px_140px_250px] gap-4 bg-zinc-50 px-5 py-4 lg:grid">
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

                {productosFiltrados.map((producto, index) => {
                  const talles = getProductoTalles(producto);

                  return (
                    <div
                      key={producto.id}
                      className={`grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,2.8fr)_120px_140px_140px_250px] lg:items-center ${
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
                          <div className="mt-3 flex flex-wrap gap-2">
                            {talles.length > 0 ? (
                              <>
                                {talles.slice(0, 6).map((talle) => (
                                  <span
                                    key={talle}
                                    className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-700"
                                  >
                                    {talle}
                                  </span>
                                ))}
                                {talles.length > 6 ? (
                                  <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
                                    +{talles.length - 6}
                                  </span>
                                ) : null}
                              </>
                            ) : (
                              <span className="text-xs text-zinc-400">
                                Sin talles cargados
                              </span>
                            )}
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

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleAbrirEdicion(producto)}
                          className="h-11 rounded-xl border-zinc-200 px-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <PencilLine className="mr-2 h-4 w-4" />
                          Editar
                        </Button>

                        <Button
                          type="button"
                          onClick={() => handleGuardarCambiosRapidos(producto)}
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
                  );
                })}

                <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-4 text-sm font-medium text-zinc-500">
                  Mostrando {productosFiltrados.length} de {productos.length} productos
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductoModal
        open={nuevoProductoOpen}
        onOpenChange={handleDialogNuevoChange}
        form={nuevoProductoForm}
        updateForm={(updater) => setNuevoProductoForm((prev) => updater(prev))}
        onSubmit={handleCrearProducto}
        title="Nuevo producto"
        description="Carga una nueva prenda con stock, promocion y talles desde el inicio."
        submitLabel="Crear producto"
        submitPending={subiendoNuevo}
        requireImage
      />

      <ProductoModal
        open={Boolean(productoEnEdicion)}
        onOpenChange={handleDialogEdicionChange}
        form={productoEnEdicion}
        updateForm={(updater) =>
          setProductoEnEdicion((prev) => (prev ? updater(prev) : prev))
        }
        onSubmit={handleEditarProducto}
        title="Editar producto"
        description="Modifica nombre, categoria, stock, precios, talles e imagen del producto."
        submitLabel="Guardar cambios"
        submitPending={guardandoEdicion}
        requireImage={false}
      />
    </>
  );
}

function ProductoModal({
  open,
  onOpenChange,
  form,
  updateForm,
  onSubmit,
  title,
  description,
  submitLabel,
  submitPending,
  requireImage,
}: ProductoModalProps) {
  if (!form) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-none bg-white p-0 shadow-2xl sm:max-w-3xl">
        <DialogHeader className="border-b border-zinc-200 px-8 py-7 text-left">
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Tag className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-zinc-950">
                {title}
              </DialogTitle>
              <p className="mt-1 text-sm text-zinc-500">{description}</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 px-8 py-8">
          <div className="space-y-5">
            <div>
              <Label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Nombre *
              </Label>
              <Input
                value={form.nombre}
                onChange={(e) =>
                  updateForm((prev) => ({
                    ...prev,
                    nombre: e.target.value,
                  }))
                }
                placeholder="Ej: Camiseta titular 2026"
                className="h-12 rounded-xl border-zinc-200 bg-white text-sm font-medium"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Precio *
                </Label>
                <Input
                  type="number"
                  value={form.precio}
                  onChange={(e) =>
                    updateForm((prev) => ({
                      ...prev,
                      precio: e.target.value,
                    }))
                  }
                  placeholder="45000"
                  className="h-12 rounded-xl border-zinc-200 bg-white text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <Label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Categoria *
                </Label>
                <select
                  value={form.categoria}
                  onChange={(e) =>
                    updateForm((prev) => ({
                      ...prev,
                      categoria: e.target.value,
                    }))
                  }
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
                <Label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Precio promocional
                </Label>
                <Input
                  type="number"
                  value={form.precioPromocional}
                  onChange={(e) =>
                    updateForm((prev) => ({
                      ...prev,
                      precioPromocional: e.target.value,
                    }))
                  }
                  placeholder="39000"
                  className="h-12 rounded-xl border-zinc-200 bg-white text-sm font-semibold"
                />
              </div>

              <div>
                <Label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Stock *
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) =>
                    updateForm((prev) => ({
                      ...prev,
                      stock: e.target.value,
                    }))
                  }
                  placeholder="12"
                  className="h-12 rounded-xl border-zinc-200 bg-white text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Talles disponibles
              </Label>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-8">
                {TALLES_PREDEFINIDOS.map((talle) => {
                  const activo = form.talles.includes(talle);

                  return (
                    <button
                      key={talle}
                      type="button"
                      onClick={() =>
                        updateForm((prev) => ({
                          ...prev,
                          talles: toggleTalle(prev.talles, talle),
                        }))
                      }
                      className={`h-10 rounded-xl border text-xs font-black uppercase tracking-[0.14em] transition-colors ${
                        activo
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                      }`}
                    >
                      {talle}
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                {form.talles.length > 0
                  ? `Seleccionados: ${form.talles.join(", ")}`
                  : "No hay talles seleccionados. Si es un producto unico, marca UNICO."}
              </p>
            </div>

            <div>
              <Label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Descripcion
              </Label>
              <textarea
                value={form.descripcion}
                onChange={(e) =>
                  updateForm((prev) => ({
                    ...prev,
                    descripcion: e.target.value,
                  }))
                }
                placeholder="Detalles de tela, cuidados, pedido o notas internas."
                className="h-28 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
              />
            </div>

            <div>
              <Label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Fotografia del producto {requireImage ? "*" : ""}
              </Label>
              <div className="space-y-3">
                {form.imagenActualUrl ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                    <img
                      src={form.imagenActualUrl}
                      alt="Imagen actual"
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                        Imagen actual
                      </p>
                      <p className="truncate text-sm font-medium text-zinc-700">
                        {form.imagen
                          ? `Nueva imagen: ${form.imagen.name}`
                          : "Se mantendra esta imagen si no subes otra."}
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="group relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 transition-colors hover:border-blue-300 hover:bg-blue-50/40">
                  <input
                    key={form.fileInputKey}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      updateForm((prev) => ({
                        ...prev,
                        imagen: e.target.files?.[0] || null,
                      }))
                    }
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    required={requireImage}
                  />
                  <ImageIcon className="mb-3 h-8 w-8 text-zinc-300 transition-colors group-hover:text-blue-600" />
                  <p className="text-center text-sm font-semibold text-zinc-700">
                    {form.imagen
                      ? form.imagen.name
                      : requireImage
                        ? "Haz click para subir una imagen"
                        : "Haz click para reemplazar la imagen"}
                  </p>
                  <p className="mt-1 text-center text-xs text-zinc-500">
                    JPG, PNG o WebP hasta 5 MB
                  </p>
                </div>
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
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-xl px-5 text-sm font-semibold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitPending}
              className="h-12 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
            >
              {submitPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Tag className="mr-2 h-4 w-4" />
                  {submitLabel}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function createEmptyForm(): ProductoFormState {
  return {
    id: "",
    nombre: "",
    descripcion: "",
    precio: "",
    precioPromocional: "",
    stock: "1",
    categoria: "Rugby",
    talles: [],
    imagen: null,
    imagenActualUrl: "",
    fileInputKey: Date.now(),
  };
}

function buildEditForm(producto: Producto): ProductoFormState {
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion?.trim() ?? "",
    precio: String(getProductoPrecio(producto)),
    precioPromocional: getProductoPrecioPromocional(producto)?.toString() ?? "",
    stock: String(
      getProductoStock(producto) ?? (isProductoDisponible(producto) ? 1 : 0)
    ),
    categoria: producto.categoria,
    talles: getProductoTalles(producto),
    imagen: null,
    imagenActualUrl: producto.imagen_url,
    fileInputKey: Date.now(),
  };
}

function buildProductoFormData(
  form: ProductoFormState,
  requireImage: boolean
) {
  const formData = new FormData();

  if (!requireImage && form.id) {
    formData.append("id", form.id);
    formData.append("imagen_actual_url", form.imagenActualUrl);
  }

  formData.append("nombre", form.nombre);
  formData.append("descripcion", form.descripcion);
  formData.append("precio", form.precio);
  formData.append("precio_promocional", form.precioPromocional);
  formData.append("stock", form.stock);
  formData.append("categoria", form.categoria);
  formData.append("talles", JSON.stringify(form.talles));

  if (form.imagen) {
    formData.append("imagen", form.imagen);
  }

  return formData;
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

function toggleTalle(talles: string[], talle: string) {
  if (talles.includes(talle)) {
    return talles.filter((item) => item !== talle);
  }

  return [...talles, talle];
}
