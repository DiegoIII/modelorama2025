const API_URL = "http://localhost:3000/products"; // Reemplaza con tu backend

// Obtener todos los productos
export const getProducts = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
};

// Obtener un solo producto por ID
export const getProductById = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Producto no encontrado");
  return await res.json();
};

// Crear un nuevo producto
export const createProduct = async (product: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return await res.json();
};

// Actualizar un producto existente
export const updateProduct = async (id: number, product: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return await res.json();
};

// Eliminar un producto
export const deleteProduct = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return res.ok;
};
