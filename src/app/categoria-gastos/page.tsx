"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";

interface CategoriaGasto {
  categoria_gasto_id: number;
  nombre_categoria_gasto: string;
  created_at?: string; // Opcional si lo necesitas
}

interface ApiResponse {
  success: boolean;
  data: CategoriaGasto[];
  message?: string;
}

const CategoriasGastosPage: React.FC = () => {
  const [categorias, setCategorias] = useState<CategoriaGasto[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:3000/api/categorias-gastos"
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setCategorias(result.data);
      } else {
        throw new Error(result.message || "Estructura de datos inesperada");
      }
    } catch (error) {
      console.error("Error al obtener las categorías de gastos:", error);
      setError("No se pudieron cargar las categorías");
      setCategorias([]); // Resetear a array vacío para evitar errores
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategoria = async () => {
    if (!nuevaCategoria.trim()) {
      setError("El nombre de la categoría no puede estar vacío");
      return;
    }

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

      const result = await response.json();

      if (response.ok && result.success) {
        setNuevaCategoria("");
        setError(null);
        fetchCategorias();
      } else {
        throw new Error(result.message || "Error al crear la categoría");
      }
    } catch (error) {
      console.error("Error al crear la categoría de gasto:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
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

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <p>Cargando categorías...</p>
          ) : (
            <ul className="mt-4">
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <li
                    key={categoria.categoria_gasto_id}
                    className="p-2 border-b"
                  >
                    {categoria.nombre_categoria_gasto}
                  </li>
                ))
              ) : (
                <p>No hay categorías disponibles</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoriasGastosPage;
