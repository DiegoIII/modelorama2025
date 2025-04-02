"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSpinner,
  faPlus,
  faBoxOpen,
  faCalendarAlt,
  faDollarSign,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";

interface Proveedor {
  proveedor_id: number;
  nombre_proveedor: string;
}

interface Compra {
  compra_id: number;
  proveedor_id: number;
  fecha_compra: string;
  total_compra: number | string;
  proveedor?: Proveedor;
  detalleCompras?: Array<{
    detalle_compra_id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    producto?: {
      nombre_producto: string;
    };
  }>;
}

interface ApiResponse {
  success: boolean;
  data: Compra[];
  message?: string;
}

const ComprasPage: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [nuevaCompra, setNuevaCompra] = useState({
    proveedor_id: 0,
    fecha_compra: "",
    total_compra: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/compras");
      const result: ApiResponse = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const comprasFormateadas = result.data.map((compra) => ({
          ...compra,
          total_compra:
            typeof compra.total_compra === "string"
              ? parseFloat(compra.total_compra)
              : compra.total_compra,
        }));
        setCompras(comprasFormateadas);
      } else {
        throw new Error(result.message || "Estructura de datos inesperada");
      }
    } catch (error) {
      console.error("Error al obtener las compras:", error);
      setError("No se pudieron cargar las compras");
      setCompras([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompra = async () => {
    if (!nuevaCompra.fecha_compra.trim() || nuevaCompra.proveedor_id <= 0) {
      setError("Proveedor y fecha son obligatorios");
      return;
    }

    try {
      const response = await fetch("/api/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proveedor_id: nuevaCompra.proveedor_id,
          fecha_compra: nuevaCompra.fecha_compra,
          total_compra: parseFloat(nuevaCompra.total_compra.toString()),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNuevaCompra({ proveedor_id: 0, fecha_compra: "", total_compra: 0 });
        setError(null);
        fetchCompras();
      } else {
        throw new Error(result.message || "Error al crear la compra");
      }
    } catch (error) {
      console.error("Error al crear la compra:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevaCompra((prev) => ({
      ...prev,
      [name]:
        name === "proveedor_id" || name === "total_compra"
          ? Number(value)
          : value,
    }));
  };

  const formatCurrency = (value: number | string): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(isNaN(num) ? 0 : num);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-3xl mr-3 text-[#F2B705]"
          />
          <h1 className="text-3xl font-bold text-[#031D40]">
            Gestión de Compras
          </h1>
        </div>

        {/* Formulario de nueva compra */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#F2B705] mb-8">
          <h2 className="text-xl font-semibold text-[#032059] mb-4 flex items-center">
            <FontAwesomeIcon icon={faPlus} className="mr-2 text-[#F2B705]" />
            Registrar Nueva Compra
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                ID Proveedor
              </label>
              <input
                type="number"
                name="proveedor_id"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                placeholder="ID del proveedor"
                value={nuevaCompra.proveedor_id || ""}
                onChange={handleInputChange}
                min="1"
              />
            </div>

            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Fecha Compra
              </label>
              <input
                type="date"
                name="fecha_compra"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                value={nuevaCompra.fecha_compra}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                Total Compra
              </label>
              <input
                type="number"
                name="total_compra"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={nuevaCompra.total_compra || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            onClick={handleCreateCompra}
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
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Registrar Compra
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Listado de compras */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-[#031D40] text-white flex items-center">
            <FontAwesomeIcon icon={faBoxOpen} className="mr-2" />
            <h2 className="text-xl font-semibold">Historial de Compras</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-4xl text-[#032059] mb-4"
              />
              <p className="text-lg text-[#031D40]">Cargando compras...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {compras.length > 0 ? (
                    compras.map((compra) => (
                      <tr
                        key={compra.compra_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {compra.compra_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {compra.proveedor?.nombre_proveedor ||
                            `Proveedor #${compra.proveedor_id}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {new Date(compra.fecha_compra).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#032059]">
                          {formatCurrency(compra.total_compra)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No hay compras registradas
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

export default ComprasPage;
