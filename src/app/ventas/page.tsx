"use client";

import React, { useEffect, useState } from "react";
import VentaForm from "app/components/VentaForm";
import VentasList from "app/components/VentasList";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCashRegister,
  faSpinner,
  faPlus,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";

interface DetalleVenta {
  producto_id: number;
  cantidad: number;
  precio: number;
  nombre_producto?: string;
}

interface Venta {
  venta_id: number;
  total_venta: number;
  fecha_venta: string;
  detalles: DetalleVenta[];
}

const VentasPage: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ventas");
      if (!response.ok) throw new Error("Error al cargar ventas");
      const data = await response.json();
      setVentas(data);
    } catch (error) {
      console.error("Error fetching ventas:", error);
      setError("No se pudieron cargar las ventas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVenta = async (venta: {
    total_venta: number;
    detalles: DetalleVenta[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venta),
      });

      if (!response.ok) throw new Error("Error al crear venta");

      // Refrescar la lista de ventas después de crear una nueva
      fetchVentas();
    } catch (error) {
      console.error("Error creating venta:", error);
      setError(
        error instanceof Error ? error.message : "Error al registrar venta"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(isNaN(value) ? 0 : value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <FontAwesomeIcon
            icon={faCashRegister}
            className="text-3xl mr-3 text-[#F2B705]"
          />
          <h1 className="text-3xl font-bold text-[#031D40]">
            Gestión de Ventas
          </h1>
        </div>

        {/* Formulario de ventas */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#F2B705] mb-8">
          <h2 className="text-xl font-semibold text-[#032059] mb-4 flex items-center">
            <FontAwesomeIcon icon={faPlus} className="mr-2 text-[#F2B705]" />
            Registrar Nueva Venta
          </h2>
          <VentaForm onSubmit={handleCreateVenta} />
          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-[#032059] mr-2"
              />
              <span>Procesando venta...</span>
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Listado de ventas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-[#031D40] text-white flex items-center">
            <FontAwesomeIcon icon={faHistory} className="mr-2" />
            <h2 className="text-xl font-semibold">Historial de Ventas</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-4xl text-[#032059] mb-4"
              />
              <p className="text-lg text-[#031D40]">Cargando ventas...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : ventas.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {ventas.map((venta) => (
                <div
                  key={venta.venta_id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#032059]">
                        Venta #{venta.venta_id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(venta.fecha_venta)}
                      </p>
                    </div>
                    <span className="font-bold text-[#032059]">
                      {formatCurrency(venta.total_venta)}
                    </span>
                  </div>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-[#031D40] mb-1">
                      Productos vendidos:
                    </h4>
                    <ul className="space-y-1">
                      {venta.detalles.map((detalle, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          •{" "}
                          {detalle.nombre_producto ||
                            `Producto ${detalle.producto_id}`}{" "}
                          - Cantidad: {detalle.cantidad} - Precio:{" "}
                          {formatCurrency(detalle.precio)} - Subtotal:{" "}
                          {formatCurrency(detalle.cantidad * detalle.precio)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No hay ventas registradas
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VentasPage;
