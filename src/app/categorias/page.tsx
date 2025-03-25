"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";

interface Categoria {
  categoria_id: number;
  nombre_categoria: string;
}

const CategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Obtener las categorías desde la API
  const fetchCategorias = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/categorias");
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  // Crear una nueva categoría
  const handleCreateCategoria = async () => {
    if (!nuevaCategoria.trim()) return;

    try {
      const response = await fetch("http://localhost:3000/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre_categoria: nuevaCategoria }),
      });

      if (response.ok) {
        setNuevaCategoria("");
        fetchCategorias(); // Actualiza la lista después de crear
      } else {
        console.error("Error al crear la categoría");
      }
    } catch (error) {
      console.error("Error al crear la categoría:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestión de Categorías
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Formulario para agregar una categoría */}
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

          {/* Lista de categorías */}
          <ul className="mt-4">
            {categorias.map((categoria) => (
              <li key={categoria.categoria_id} className="p-2 border-b">
                {categoria.nombre_categoria}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default CategoriasPage;
