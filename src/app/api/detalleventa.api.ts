const API_URL = "http://localhost:3000/detalleventas"; // Cambia el endpoint a tu backend de detalleventas

// Obtener todos los detalles de ventas
export const getDetalleVentas = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener detalles de ventas");
  return await res.json();
};

// Obtener un solo detalle de venta por ID
export const getDetalleVentaById = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Detalle de venta no encontrado");
  return await res.json();
};

// Crear un nuevo detalle de venta
export const createDetalleVenta = async (detalleVenta: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(detalleVenta),
  });
  if (!res.ok) throw new Error("Error al crear detalle de venta");
  return await res.json();
};

// Actualizar un detalle de venta existente
export const updateDetalleVenta = async (id: number, detalleVenta: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(detalleVenta),
  });
  if (!res.ok) throw new Error("Error al actualizar detalle de venta");
  return await res.json();
};

// Eliminar un detalle de venta
export const deleteDetalleVenta = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar detalle de venta");
  return res.ok;
};
