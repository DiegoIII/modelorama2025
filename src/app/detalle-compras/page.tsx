"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faSpinner,
  faPlus,
  faBox,
  faShoppingCart,
  faHashtag,
  faDollarSign,
  faCalculator,
} from "@fortawesome/free-solid-svg-icons";

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
      const response = await fetch("/api/detalle-compras");
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
      const response = await fetch("/api/compras");
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
      const response = await fetch("/api/productos");
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
      const response = await fetch("/api/detalle-compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoDetalle),
      });

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
      [name]: [
        "compra_id",
        "producto_id",
        "cantidad",
        "precio_unitario",
      ].includes(name)
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <FontAwesomeIcon
            icon={faReceipt}
            className="text-3xl mr-3 text-[#F2B705]"
          />
          <h1 className="text-3xl font-bold text-[#031D40]">
            Detalle de Compras
          </h1>
        </div>

        {/* Formulario de nuevo detalle */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#F2B705] mb-8">
          <h2 className="text-xl font-semibold text-[#032059] mb-4 flex items-center">
            <FontAwesomeIcon icon={faPlus} className="mr-2 text-[#F2B705]" />
            Nuevo Detalle de Compra
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Compra
              </label>
              <select
                name="compra_id"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
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
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faBox} className="mr-2" />
                Producto
              </label>
              <select
                name="producto_id"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
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
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faHashtag} className="mr-2" />
                Cantidad
              </label>
              <input
                type="number"
                name="cantidad"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                placeholder="Cantidad"
                min="1"
                value={nuevoDetalle.cantidad || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                Precio Unitario
              </label>
              <input
                type="number"
                name="precio_unitario"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                value={nuevoDetalle.precio_unitario || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            onClick={handleCreateDetalle}
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
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-1" />{" "}
                      Compra
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
                        key={detalle.detalle_compra_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {detalle.detalle_compra_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          Compra #{detalle.compra_id}
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
                        No hay detalles de compra registrados
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

export default DetalleComprasPage;
