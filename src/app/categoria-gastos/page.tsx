"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";

interface CategoriaGasto {
  categoria_gasto_id: number;
  nombre_categoria_gasto: string;
}

const CategoriasGastosPage: React.FC = () => {
  const [categorias, setCategorias] = useState<CategoriaGasto[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

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
      console.error("Error al obtener las categorías de gastos:", error);
    }
  };

  const handleCreateCategoria = async () => {
    if (!nuevaCategoria.trim()) return;

    try {
      const response = await fetch(
        "http://localhost:3000/api/categorias-gastos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre_categoria_gasto: nuevaCategoria }),
        }
      );

      if (response.ok) {
        setNuevaCategoria("");
        fetchCategorias(); // Recargar la lista de categorías
      } else {
        console.error("Error al crear la categoría de gasto");
      }
    } catch (error) {
      console.error("Error al crear la categoría de gasto:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Categorías de Gastos
        </h1>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Nueva categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
            />
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleCreateCategoria}
            >
              Agregar Categoría
            </button>
          </div>
          <ul className="mt-4">
            {categorias.map((categoria) => (
              <li key={categoria.categoria_gasto_id} className="p-2 border-b">
                {categoria.nombre_categoria_gasto}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default CategoriasGastosPage;
