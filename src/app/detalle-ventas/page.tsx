"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";

interface DetalleVenta {
  detalle_venta_id: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  venta?: {
    venta_id: number;
    fecha_venta: string;
  };
  producto?: {
    producto_id: number;
    nombre_producto: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: DetalleVenta[];
  message?: string;
}

const DetalleVentasPage: React.FC = () => {
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [ventas, setVentas] = useState<any[]>([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    venta_id: "",
    producto_id: "",
    cantidad: 1,
    precio_unitario: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDetalleVentas();
    fetchProductos();
    fetchVentas();
  }, []);

  // Obtener detalle_ventas
  const fetchDetalleVentas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/detalle-ventas");

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
      console.error("Error al obtener detalle de ventas:", error);
      setError("No se pudieron cargar los detalles de venta");
      setDetalles([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener productos
  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/productos");
      const data = await response.json();
      if (data.success) {
        setProductos(data.data);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // Obtener ventas
  const fetchVentas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/ventas");
      const data = await response.json();
      if (data.success) {
        setVentas(data.data);
      }
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  // Crear nuevo detalle de venta
  const handleCreateDetalleVenta = async () => {
    const { venta_id, producto_id, cantidad, precio_unitario } = nuevoDetalle;

    if (!venta_id || !producto_id || cantidad <= 0 || precio_unitario <= 0) {
      setError(
        "Todos los campos son obligatorios y deben ser valores positivos"
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/detalle-ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venta_id: parseInt(venta_id),
          producto_id: parseInt(producto_id),
          cantidad,
          precio_unitario,
          subtotal: cantidad * precio_unitario,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNuevoDetalle({
          venta_id: "",
          producto_id: "",
          cantidad: 1,
          precio_unitario: 0,
        });
        setError(null);
        fetchDetalleVentas();
      } else {
        throw new Error(result.message || "Error al crear el detalle de venta");
      }
    } catch (error) {
      console.error("Error al crear detalle de venta:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    }
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
          Gestión de Detalles de Ventas
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Formulario para agregar detalle de venta */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Venta</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={nuevoDetalle.venta_id}
                onChange={(e) =>
                  setNuevoDetalle({ ...nuevoDetalle, venta_id: e.target.value })
                }
              >
                <option value="">Selecciona una venta</option>
                {ventas.map((venta) => (
                  <option key={venta.venta_id} value={venta.venta_id}>
                    Venta #{venta.venta_id} -{" "}
                    {new Date(venta.fecha_venta).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Producto</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={nuevoDetalle.producto_id}
                onChange={(e) =>
                  setNuevoDetalle({
                    ...nuevoDetalle,
                    producto_id: e.target.value,
                  })
                }
              >
                <option value="">Selecciona un producto</option>
                {productos.map((producto) => (
                  <option
                    key={producto.producto_id}
                    value={producto.producto_id}
                  >
                    {producto.nombre_producto || producto.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Cantidad"
                min="1"
                value={nuevoDetalle.cantidad || ""}
                onChange={(e) =>
                  setNuevoDetalle({
                    ...nuevoDetalle,
                    cantidad: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Precio Unitario
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Precio"
                step="0.01"
                min="0.01"
                value={nuevoDetalle.precio_unitario || ""}
                onChange={(e) =>
                  setNuevoDetalle({
                    ...nuevoDetalle,
                    precio_unitario: Number(e.target.value),
                  })
                }
              />
            </div>

            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 col-span-4"
              onClick={handleCreateDetalleVenta}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Agregar Detalle de Venta"}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Lista de detalles de venta */}
          <div className="mt-6 overflow-x-auto">
            {loading ? (
              <div className="text-center py-4">
                <p>Cargando detalles de venta...</p>
              </div>
            ) : (
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Venta</th>
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
                        key={detalle.detalle_venta_id}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-2 px-4 border text-center">
                          {detalle.detalle_venta_id}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          Venta #{detalle.venta_id}
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
                        No hay detalles de venta registrados
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

export default DetalleVentasPage;
