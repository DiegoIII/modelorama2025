"use client";

import React, { useEffect, useState } from "react";
import GastoForm from "app/components/GastoForm";
import GastosList from "app/components/GastosList";
import Layout from "app/layout/Layout";

interface CategoriaGasto {
  categoria_gasto_id: number;
  nombre: string;
}

const GastosPage: React.FC = () => {
  const [categorias, setCategorias] = useState<CategoriaGasto[]>([]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/categorias-gastos"
      );
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const handleCreateGasto = async (gasto: {
    description: string;
    monto: number;
    categoria_gasto_id: number;
  }) => {
    try {
      await fetch("http://localhost:3000/api/gastos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gasto),
      });
      // Refrescar la lista de gastos después de crear uno nuevo
      window.location.reload();
    } catch (error) {
      console.error("Error creating gasto:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestión de Gastos
        </h1>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <GastoForm onSubmit={handleCreateGasto} categorias={categorias} />
        </div>
        <div className="mt-8">
          <GastosList />
        </div>
      </div>
    </Layout>
  );
};

export default GastosPage;
