"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Producto {
  producto_id: number;
  nombre: string;
}

const InventarioForm = ({ productos = [] }: { productos?: Producto[] }) => {
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [productosList, setProductosList] = useState<Producto[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const router = useRouter();

  // Usamos useMemo para evitar recrear el array de productos en cada render
  const memoizedProductos = useMemo(() => productos, [productos]);

  // Efecto para cargar productos solo en el montaje inicial
  useEffect(() => {
    if (initialLoad) {
      if (memoizedProductos && Array.isArray(memoizedProductos)) {
        setProductosList(memoizedProductos);
      } else {
        const fetchProductos = async () => {
          try {
            const response = await fetch("/api/productos");
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
              setProductosList(data.data);
            } else {
              throw new Error("Formato de datos inválido");
            }
          } catch (err) {
            console.error("Error cargando productos:", err);
            setError("No se pudieron cargar los productos");
          }
        };
        fetchProductos();
      }
      setInitialLoad(false);
    }
  }, [memoizedProductos, initialLoad]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!producto || cantidad <= 0) {
      setError("Producto y cantidad son requeridos (cantidad > 0)");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/inventario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          producto_id: Number(producto),
          cantidad: Number(cantidad),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al agregar inventario");
      }

      setProducto("");
      setCantidad(0);
      router.refresh();
    } catch (err) {
      console.error("Error al agregar inventario:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Producto
        </label>
        <select
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          disabled={loading || productosList.length === 0}
        >
          <option value="">
            {productosList.length === 0
              ? "Cargando productos..."
              : "Seleccione un producto"}
          </option>
          {productosList.map((prod) => (
            <option key={prod.producto_id} value={prod.producto_id}>
              {prod.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cantidad
        </label>
        <input
          type="number"
          min="1"
          value={cantidad || ""}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={
          loading || !producto || cantidad <= 0 || productosList.length === 0
        }
        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Procesando..." : "Agregar al Inventario"}
      </button>
    </form>
  );
};

export default InventarioForm;
