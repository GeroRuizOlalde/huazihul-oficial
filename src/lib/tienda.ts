export type ProductoVariante = {
  talle: string;
  stock: number;
};

export type Producto = {
  id: string;
  nombre: string;
  descripcion?: string | null;
  precio: number | string | null;
  precio_promocional?: number | string | null;
  imagen_url: string;
  imagenes_extra?: string[] | string | null;
  categoria: string;
  en_stock?: boolean | null;
  stock?: number | string | null;
  talles?: string[] | string | null;
  variantes?:
    | ProductoVariante[]
    | Array<{ talle?: unknown; stock?: unknown }>
    | string
    | null;
  colores?: string[] | string | null;
  visible?: boolean | null;
};

export const TALLES_PREDEFINIDOS = [
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
] as const;

const TALLE_ORDER = new Map<string, number>(
  TALLES_PREDEFINIDOS.map((talle, index) => [talle, index])
);

function parseNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeTalle(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toUpperCase();
}

function normalizeColor(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

function normalizeImageUrl(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeStock(value: unknown) {
  const parsed = parseNumber(value);

  if (parsed === null) {
    return 0;
  }

  return Math.max(0, Math.floor(parsed));
}

function compareTalles(a: string, b: string) {
  const orderA = TALLE_ORDER.get(a);
  const orderB = TALLE_ORDER.get(b);

  if (orderA !== undefined && orderB !== undefined) {
    return orderA - orderB;
  }

  if (orderA !== undefined) {
    return -1;
  }

  if (orderB !== undefined) {
    return 1;
  }

  return a.localeCompare(b, "es", { numeric: true, sensitivity: "base" });
}

function parseArrayLike(value: unknown) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  const trimmed = value.trim();

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return trimmed.split(",");
    }
  }

  return trimmed.split(",");
}

function parseStringArray(
  value: unknown,
  normalizeItem: (item: unknown) => string
) {
  const items = parseArrayLike(value);
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    const normalized = normalizeItem(item);
    const key = normalized.toLowerCase();

    if (!normalized || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(normalized);
  }

  return result;
}

function parseTalles(value: unknown) {
  return sortTalles(parseStringArray(value, normalizeTalle));
}

function parseColores(value: unknown) {
  return parseStringArray(value, normalizeColor);
}

function parseImagenesExtra(value: unknown) {
  return parseStringArray(value, normalizeImageUrl);
}

function parseVariantesValue(value: Producto["variantes"]) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildFallbackVariantes(
  producto: Pick<Producto, "talles" | "stock">
): ProductoVariante[] {
  const talles = parseTalles(producto.talles);

  if (talles.length === 0) {
    return [];
  }

  const totalStock = Math.max(parseNumber(producto.stock) ?? 0, 0);

  if (totalStock === 0) {
    return talles.map((talle) => ({ talle, stock: 0 }));
  }

  const baseStock = Math.floor(totalStock / talles.length);
  let remainder = totalStock % talles.length;

  return talles.map((talle) => {
    const extra = remainder > 0 ? 1 : 0;
    remainder = Math.max(0, remainder - 1);

    return {
      talle,
      stock: baseStock + extra,
    };
  });
}

export function sortTalles<T extends string>(talles: T[]) {
  return [...talles].sort(compareTalles);
}

export function formatPrecio(value: number) {
  return new Intl.NumberFormat("es-AR").format(value);
}

export function getProductoPrecio(producto: Pick<Producto, "precio">) {
  return Math.max(parseNumber(producto.precio) ?? 0, 0);
}

export function getProductoPrecioPromocional(
  producto: Pick<Producto, "precio" | "precio_promocional">
) {
  const precio = getProductoPrecio(producto);
  const precioPromocional = parseNumber(producto.precio_promocional);

  if (precioPromocional === null || precioPromocional <= 0) {
    return null;
  }

  if (precio > 0 && precioPromocional >= precio) {
    return null;
  }

  return precioPromocional;
}

export function hasProductoPromocion(
  producto: Pick<Producto, "precio" | "precio_promocional">
) {
  return getProductoPrecioPromocional(producto) !== null;
}

export function getProductoVariantes(
  producto: Pick<Producto, "variantes" | "talles" | "stock">
) {
  const parsed = parseVariantesValue(producto.variantes);
  const byTalle = new Map<string, number>();

  for (const item of parsed) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const talle = normalizeTalle(item.talle);

    if (!talle) {
      continue;
    }

    byTalle.set(talle, (byTalle.get(talle) ?? 0) + normalizeStock(item.stock));
  }

  if (byTalle.size > 0) {
    return sortTalles(Array.from(byTalle.keys())).map((talle) => ({
      talle,
      stock: byTalle.get(talle) ?? 0,
    }));
  }

  return buildFallbackVariantes(producto);
}

export function getProductoTalleStock(
  producto: Pick<Producto, "variantes" | "talles" | "stock">,
  talle: string
) {
  const talleNormalizado = normalizeTalle(talle);

  if (!talleNormalizado) {
    return 0;
  }

  const variantes = getProductoVariantes(producto);
  const variante = variantes.find((item) => item.talle === talleNormalizado);

  return variante?.stock ?? 0;
}

export function getProductoStock(
  producto: Pick<Producto, "stock" | "talles" | "variantes">
) {
  const variantes = getProductoVariantes(producto);

  if (variantes.length > 0) {
    return variantes.reduce((total, variante) => total + variante.stock, 0);
  }

  const stock = parseNumber(producto.stock);

  if (stock === null) {
    return null;
  }

  return Math.max(0, Math.floor(stock));
}

export function getProductoTalles(
  producto: Pick<Producto, "talles" | "stock" | "variantes">
) {
  const variantes = getProductoVariantes(producto);

  if (variantes.length > 0) {
    return variantes.map((variante) => variante.talle);
  }

  return parseTalles(producto.talles);
}

export function getProductoTallesDisponibles(
  producto: Pick<Producto, "talles" | "stock" | "variantes">
) {
  const variantes = getProductoVariantes(producto);

  if (variantes.length > 0) {
    return variantes
      .filter((variante) => variante.stock > 0)
      .map((variante) => variante.talle);
  }

  const talles = parseTalles(producto.talles);
  const stock = Math.max(parseNumber(producto.stock) ?? 0, 0);

  return stock > 0 ? talles : [];
}

export function getProductoColores(producto: Pick<Producto, "colores">) {
  return parseColores(producto.colores);
}

export function getProductoImagenes(
  producto: Pick<Producto, "imagen_url" | "imagenes_extra">
) {
  return parseStringArray(
    [producto.imagen_url, ...parseImagenesExtra(producto.imagenes_extra)],
    normalizeImageUrl
  );
}

export function isProductoVisible(producto: Pick<Producto, "visible">) {
  return producto.visible !== false;
}

export function isProductoDisponible(
  producto: Pick<Producto, "stock" | "talles" | "variantes" | "en_stock">
) {
  const stock = getProductoStock(producto);

  if (stock !== null) {
    return stock > 0;
  }

  if (typeof producto.en_stock === "boolean") {
    return producto.en_stock;
  }

  return true;
}

export function isProductoAgotado(
  producto: Pick<Producto, "stock" | "talles" | "variantes" | "en_stock">
) {
  return !isProductoDisponible(producto);
}

export function isProductoBajoStock(
  producto: Pick<Producto, "stock" | "talles" | "variantes" | "en_stock">,
  threshold = 3
) {
  const stock = getProductoStock(producto);

  if (stock === null) {
    return false;
  }

  return stock > 0 && stock <= threshold;
}

export function getProductoStockTexto(
  producto: Pick<Producto, "stock" | "talles" | "variantes" | "en_stock">
) {
  const stock = getProductoStock(producto);

  if (stock === null) {
    return isProductoDisponible(producto) ? "Disponible" : "Sin stock";
  }

  if (stock === 0) {
    return "Sin stock";
  }

  if (stock === 1) {
    return "Ultima unidad";
  }

  if (stock <= 3) {
    return `Ultimas ${stock} unidades`;
  }

  return `Stock: ${stock}`;
}
