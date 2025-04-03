"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faSpinner,
  faPlus,
  faBox,
  faCashRegister,
  faHashtag,
  faDollarSign,
  faCalculator,
} from "@fortawesome/free-solid-svg-icons";

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

  const fetchDetalleVentas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/detalle-ventas");
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

  const fetchProductos = async () => {
    try {
      const response = await fetch("/api/productos");
      const data = await response.json();
      if (data.success) {
        setProductos(data.data);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const fetchVentas = async () => {
    try {
      const response = await fetch("/api/ventas");
      const data = await response.json();
      if (data.success) {
        setVentas(data.data);
      }
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  const handleCreateDetalleVenta = async () => {
    const { venta_id, producto_id, cantidad, precio_unitario } = nuevoDetalle;

    if (!venta_id || !producto_id || cantidad <= 0 || precio_unitario <= 0) {
      setError(
        "Todos los campos son obligatorios y deben ser valores positivos"
      );
      return;
    }

    try {
      const response = await fetch("/api/detalle-ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <FontAwesomeIcon
            icon={faReceipt}
            className="text-3xl mr-3 text-[#F2B705]"
          />
          <h1 className="text-3xl font-bold text-[#031D40]">
            Detalle de Ventas
          </h1>
        </div>

        {/* Formulario de nuevo detalle */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#F2B705] mb-8">
          <h2 className="text-xl font-semibold text-[#032059] mb-4 flex items-center">
            <FontAwesomeIcon icon={faPlus} className="mr-2 text-[#F2B705]" />
            Nuevo Detalle de Venta
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faCashRegister} className="mr-2" />
                Venta
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
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
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faBox} className="mr-2" />
                Producto
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
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
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faHashtag} className="mr-2" />
                Cantidad
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
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
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                Precio Unitario
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                placeholder="0.00"
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
          </div>

          <button
            onClick={handleCreateDetalleVenta}
            disabled={loading}
            className="bg-[#032059] hover:bg-[#031D40] text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors w-full md:w-auto"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Procesando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Detalle
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Listado de detalles */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-[#031D40] text-white flex items-center">
            <FontAwesomeIcon icon={faCalculator} className="mr-2" />
            <h2 className="text-xl font-semibold">Historial de Detalles</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-4xl text-[#032059] mb-4"
              />
              <p className="text-lg text-[#031D40]">Cargando detalles...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faHashtag} className="mr-1" /> ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faCashRegister} className="mr-1" />{" "}
                      Venta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faBox} className="mr-1" /> Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faHashtag} className="mr-1" />{" "}
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faDollarSign} className="mr-1" />{" "}
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faCalculator} className="mr-1" />{" "}
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detalles.length > 0 ? (
                    detalles.map((detalle) => (
                      <tr
                        key={detalle.detalle_venta_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {detalle.detalle_venta_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          Venta #{detalle.venta_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {detalle.producto?.nombre_producto ||
                            `Producto #${detalle.producto_id}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {detalle.cantidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {formatCurrency(detalle.precio_unitario)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#032059]">
                          {formatCurrency(detalle.subtotal)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No hay detalles de venta registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DetalleVentasPage;
