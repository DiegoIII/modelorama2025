"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";

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
      const response = await fetch("http://localhost:3000/api/compras");

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success && Array.isArray(result.data)) {
        // Aseguramos que total_compra sea número
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
      const response = await fetch("http://localhost:3000/api/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proveedor_id: nuevaCompra.proveedor_id,
          fecha_compra: nuevaCompra.fecha_compra,
          total_compra: parseFloat(nuevaCompra.total_compra.toString()),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNuevaCompra({
          proveedor_id: 0,
          fecha_compra: "",
          total_compra: 0,
        });
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
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestión de Compras
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Formulario para agregar una compra */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">ID Proveedor</label>
              <input
                type="number"
                name="proveedor_id"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="ID del proveedor"
                value={nuevaCompra.proveedor_id || ""}
                onChange={handleInputChange}
                min="1"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Fecha Compra</label>
              <input
                type="date"
                name="fecha_compra"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={nuevaCompra.fecha_compra}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Total Compra</label>
              <input
                type="number"
                name="total_compra"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Total"
                step="0.01"
                min="0"
                value={nuevaCompra.total_compra || ""}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 col-span-3"
              onClick={handleCreateCompra}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Registrar Compra"}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Lista de compras */}
          <div className="mt-6 overflow-x-auto">
            {loading ? (
              <div className="text-center py-4">
                <p>Cargando compras...</p>
              </div>
            ) : (
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Proveedor</th>
                    <th className="py-2 px-4 border">Fecha</th>
                    <th className="py-2 px-4 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.length > 0 ? (
                    compras.map((compra) => (
                      <tr key={compra.compra_id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border text-center">
                          {compra.compra_id}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {compra.proveedor?.nombre_proveedor ||
                            `Proveedor #${compra.proveedor_id}`}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {new Date(compra.fecha_compra).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {formatCurrency(compra.total_compra)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-gray-500"
                      >
                        No hay compras registradas
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

export default ComprasPage;
