"use client";

import React, { useState } from "react";
import GastoForm from "app/components/GastoForm";
import GastosList from "app/components/GastosList";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faSpinner,
  faPlus,
  faHistory,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const GastosPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("registrar");

  const handleCreateGasto = async (gasto: {
    descripcion: string;
    monto: number;
    categoria_gasto_id: number;
    fecha: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gastos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gasto),
      });

      if (!response.ok) {
        throw new Error("Error al crear el gasto");
      }

      // Refrescar la lista de gastos después de crear uno nuevo
      window.location.reload();
    } catch (error) {
      console.error("Error creating gasto:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al crear gasto"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <FontAwesomeIcon
              icon={faMoneyBillWave}
              className="text-3xl mr-3 text-[#F2B705]"
            />
            <h1 className="text-3xl font-bold text-[#031D40]">
              Gestión de Gastos
            </h1>
          </div>

          {/* Pestañas */}
          <div className="flex border-b border-gray-200 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("registrar")}
              className={`py-2 px-4 font-medium text-sm flex items-center ${
                activeTab === "registrar"
                  ? "text-[#F2B705] border-b-2 border-[#F2B705]"
                  : "text-gray-500 hover:text-[#032059]"
              }`}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Registrar Gasto
            </button>
            <button
              onClick={() => setActiveTab("historial")}
              className={`py-2 px-4 font-medium text-sm flex items-center ${
                activeTab === "historial"
                  ? "text-[#F2B705] border-b-2 border-[#F2B705]"
                  : "text-gray-500 hover:text-[#032059]"
              }`}
            >
              <FontAwesomeIcon icon={faHistory} className="mr-2" />
              Historial
            </button>
            <button
              onClick={() => setActiveTab("reportes")}
              className={`py-2 px-4 font-medium text-sm flex items-center ${
                activeTab === "reportes"
                  ? "text-[#F2B705] border-b-2 border-[#F2B705]"
                  : "text-gray-500 hover:text-[#032059]"
              }`}
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-2" />
              Reportes
            </button>
          </div>
        </div>

        {/* Contenido de pestañas */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {activeTab === "registrar" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#032059] mb-6 flex items-center">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="mr-2 text-[#F2B705]"
                />
                Registrar Nuevo Gasto
              </h2>
              <div className="max-w-2xl mx-auto">
                <GastoForm onSubmit={handleCreateGasto} />
                {loading && (
                  <div className="mt-6 flex items-center justify-center text-[#032059]">
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    <span>Procesando gasto...</span>
                  </div>
                )}
                {error && (
                  <div className="mt-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "historial" && (
            <div>
              <div className="p-4 bg-[#031D40] text-white flex items-center">
                <FontAwesomeIcon icon={faHistory} className="mr-2" />
                <h2 className="text-xl font-semibold">Historial de Gastos</h2>
              </div>
              <div className="p-4">
                <GastosList />
              </div>
            </div>
          )}

          {activeTab === "reportes" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#032059] mb-6 flex items-center">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="mr-2 text-[#F2B705]"
                />
                Reportes de Gastos
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-blue-800">
                  Módulo de reportes en desarrollo
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  Próximamente podrás ver gráficos y análisis de tus gastos
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-[#F2B705]">
            <h3 className="text-sm font-medium text-gray-500">
              Gastos este mes
            </h3>
            <p className="text-2xl font-bold text-[#032059]">$12,345.67</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-[#032059]">
            <h3 className="text-sm font-medium text-gray-500">
              Categoría principal
            </h3>
            <p className="text-2xl font-bold text-[#032059]">Suministros</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-[#F2B705]">
            <h3 className="text-sm font-medium text-gray-500">
              Promedio diario
            </h3>
            <p className="text-2xl font-bold text-[#032059]">$411.52</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GastosPage;
