"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";

interface DetalleCompra {
  detalle_compra_id: number;
  compra_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  compra?: {
    compra_id: number;
    fecha_compra: string;
  };
  producto?: {
    producto_id: number;
    nombre_producto: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: DetalleCompra[];
  message?: string;
}

const DetalleComprasPage: React.FC = () => {
  const [detalles, setDetalles] = useState<DetalleCompra[]>([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    compra_id: 0,
    producto_id: 0,
    cantidad: 0,
    precio_unitario: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compras, setCompras] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    fetchDetalles();
    fetchCompras();
    fetchProductos();
  }, []);

  const fetchDetalles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/detalle-compras");

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setDetalles(result.data);
      } else {
        throw new Error(result.message || "Estructura de datos inesperada");
      }
    } catch (error) {
      console.error("Error al obtener los detalles:", error);
      setError("No se pudieron cargar los detalles de compra");
      setDetalles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompras = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/compras");
      const data = await response.json();
      if (data.success) {
        setCompras(data.data);
      }
    } catch (error) {
      console.error("Error al obtener las compras:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/productos");
      const data = await response.json();
      if (data.success) {
        setProductos(data.data);
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const handleCreateDetalle = async () => {
    if (
      nuevoDetalle.compra_id <= 0 ||
      nuevoDetalle.producto_id <= 0 ||
      nuevoDetalle.cantidad <= 0 ||
      nuevoDetalle.precio_unitario <= 0
    ) {
      setError(
        "Todos los campos son obligatorios y deben ser valores positivos"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/detalle-compras",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoDetalle),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setNuevoDetalle({
          compra_id: 0,
          producto_id: 0,
          cantidad: 0,
          precio_unitario: 0,
        });
        setError(null);
        fetchDetalles();
      } else {
        throw new Error(
          result.message || "Error al crear el detalle de compra"
        );
      }
    } catch (error) {
      console.error("Error al crear el detalle de compra:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al crear el detalle"
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNuevoDetalle((prev) => ({
      ...prev,
      [name]:
        name === "compra_id" ||
        name === "producto_id" ||
        name === "cantidad" ||
        name === "precio_unitario"
          ? Number(value)
          : value,
    }));
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(isNaN(value) ? 0 : value);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestión de Detalles de Compra
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Formulario para agregar un detalle */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Compra</label>
              <select
                name="compra_id"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={nuevoDetalle.compra_id || ""}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una compra</option>
                {compras.map((compra) => (
                  <option key={compra.compra_id} value={compra.compra_id}>
                    Compra #{compra.compra_id} -{" "}
                    {new Date(compra.fecha_compra).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Producto</label>
              <select
                name="producto_id"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={nuevoDetalle.producto_id || ""}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option
                    key={producto.producto_id}
                    value={producto.producto_id}
                  >
                    {producto.nombre_producto}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Cantidad"
                min="1"
                value={nuevoDetalle.cantidad || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">
                Precio Unitario
              </label>
              <input
                type="number"
                name="precio_unitario"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Precio"
                step="0.01"
                min="0.01"
                value={nuevoDetalle.precio_unitario || ""}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 col-span-4"
              onClick={handleCreateDetalle}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Agregar Detalle"}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Lista de detalles */}
          <div className="mt-6 overflow-x-auto">
            {loading ? (
              <div className="text-center py-4">
                <p>Cargando detalles...</p>
              </div>
            ) : (
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Compra</th>
                    <th className="py-2 px-4 border">Producto</th>
                    <th className="py-2 px-4 border">Cantidad</th>
                    <th className="py-2 px-4 border">Precio Unitario</th>
                    <th className="py-2 px-4 border">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.length > 0 ? (
                    detalles.map((detalle) => (
                      <tr
                        key={detalle.detalle_compra_id}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-2 px-4 border text-center">
                          {detalle.detalle_compra_id}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          Compra #{detalle.compra_id}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {detalle.producto?.nombre_producto ||
                            `Producto #${detalle.producto_id}`}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {detalle.cantidad}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {formatCurrency(detalle.precio_unitario)}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {formatCurrency(detalle.subtotal)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-center text-gray-500"
                      >
                        No hay detalles de compra registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetalleComprasPage;
