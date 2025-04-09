import { product as Product } from "./product";

export interface Inventario {
  id: number; // Identificador único del inventario
  productos: Product[]; // Lista de productos en el inventario
  fechaIngreso: string; // Fecha en la que el inventario fue registrado
  totalProductos: number; // Total de productos en el inventario
  ubicacion: string; // Ubicación del inventario (por ejemplo, bodega o tienda)
  estado: "activo" | "inactivo"; // Estado del inventario (activo o inactivo)
}
