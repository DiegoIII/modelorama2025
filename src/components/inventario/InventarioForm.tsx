"use client";
import { useState, useEffect } from "react";

interface Product {
  producto_id: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  categoria: string;
  proveedor: string;
}

interface InventarioFormProps {
  onInventarioAdded: () => void;
}

const InventarioForm = ({ onInventarioAdded }: InventarioFormProps) => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("/api/productos");
        if (!response.ok) {
          throw new Error("Error al obtener productos");
        }
        const data = await response.json();

        // Asegúrate de que la respuesta sea un array
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error("Formato de datos inesperado:", data);
          setError("Formato de datos inesperado");
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!productoId || !cantidad) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch("/api/inventario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          producto_id: parseInt(productoId),
          cantidad: parseInt(cantidad),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al agregar al inventario");
      }

      onInventarioAdded();
      setProductoId("");
      setCantidad("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-[#F2B705]">
      <h2 className="text-xl font-semibold mb-4 text-[#032059]">
        Agregar al Inventario
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Producto
          </label>
          {loading ? (
            <div className="flex items-center text-gray-500">
              <span className="mr-2">Cargando productos...</span>
              <div className="animate-spin">🔄</div>
            </div>
          ) : productos.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay productos disponibles. Crea primero un producto.
            </p>
          ) : (
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#032059] focus:border-[#032059]"
              required
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.producto_id} value={producto.producto_id}>
                  {producto.nombre} - {producto.categoria} ($
                  {producto.precio_venta})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad
          </label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#032059] focus:border-[#032059]"
            required
            min="1"
            placeholder="Ingrese la cantidad"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-[#032059] hover:bg-[#031D40]"
          } transition-colors`}
          disabled={loading || productos.length === 0}
        >
          {loading ? "Procesando..." : "Agregar al Inventario"}
        </button>
      </form>
    </div>
  );
};

export default InventarioForm;
