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
  categoria: string;
  en_stock?: boolean | null;
  stock?: number | string | null;
  talles?: string[] | string | null;
  variantes?:
    | ProductoVariante[]
    | Array<{ talle?: unknown; stock?: unknown }>
    | string
    | null;
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

function parseTalles(value: unknown) {
  let talles: string[] = [];

  if (Array.isArray(value)) {
    talles = value.filter((item): item is string => typeof item === "string");
  } else if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);

        if (Array.isArray(parsed)) {
          talles = parsed.filter((item): item is string => typeof item === "string");
        }
      } catch {
        talles = trimmed.split(",");
      }
    } else {
      talles = trimmed.split(",");
    }
  }

  return sortTalles(
    Array.from(
      new Set(
        talles
          .map((item) => normalizeTalle(item))
          .filter(Boolean)
      )
    )
  );
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
