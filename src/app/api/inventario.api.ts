const API_URL = "http://localhost:3000/inventarios"; // Cambia el endpoint a tu backend de inventarios

// Obtener todos los inventarios
export const getInventarios = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener inventarios");
  return await res.json();
};

// Obtener un solo inventario por ID
export const getInventarioById = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Inventario no encontrado");
  return await res.json();
};

// Crear un nuevo inventario
export const createInventario = async (inventario: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inventario),
  });
  if (!res.ok) throw new Error("Error al crear inventario");
  return await res.json();
};

// Actualizar un inventario existente
export const updateInventario = async (id: number, inventario: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inventario),
  });
  if (!res.ok) throw new Error("Error al actualizar inventario");
  return await res.json();
};

// Eliminar un inventario
export const deleteInventario = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar inventario");
  return res.ok;
};
