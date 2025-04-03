"use client";

import React, { useState } from "react";
import GastoForm from "app/components/GastoForm";
import GastosList from "app/components/GastosList";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillWave, faSpinner } from "@fortawesome/free-solid-svg-icons";

const GastosPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <div className="flex items-center mb-8">
          <FontAwesomeIcon
            icon={faMoneyBillWave}
            className="text-3xl mr-3 text-[#F2B705]"
          />
          <h1 className="text-3xl font-bold text-[#031D40]">
            Gestión de Gastos
          </h1>
        </div>

        {/* Formulario de gastos */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#F2B705] mb-8">
          <h2 className="text-xl font-semibold text-[#032059] mb-4">
            Registrar Nuevo Gasto
          </h2>
          <GastoForm onSubmit={handleCreateGasto} />
          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-[#032059] mr-2"
              />
              <span>Procesando gasto...</span>
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Listado de gastos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-[#031D40] text-white">
            <h2 className="text-xl font-semibold">Historial de Gastos</h2>
          </div>
          <div className="p-4">
            <GastosList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GastosPage;
