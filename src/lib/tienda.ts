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
};

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

export function getProductoStock(producto: Pick<Producto, "stock">) {
  const stock = parseNumber(producto.stock);

  if (stock === null) {
    return null;
  }

  return Math.max(0, Math.floor(stock));
}

export function isProductoDisponible(
  producto: Pick<Producto, "stock" | "en_stock">
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
  producto: Pick<Producto, "stock" | "en_stock">
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

export function getProductoTalles(producto: Pick<Producto, "talles">) {
  const value = producto.talles;

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

  return Array.from(
    new Set(
      talles
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean)
    )
  );
}
