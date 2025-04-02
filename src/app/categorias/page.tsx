"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";

interface Categoria {
  categoria_id: number;
  nombre_categoria: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

const CategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/categorias");

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setCategorias(data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      setError("No se pudieron cargar las categorías");
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
      const response = await fetch("http://localhost:3000/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre_categoria: nuevaCategoria }),
      });

      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        setNuevaCategoria("");
        setError(null);
        fetchCategorias();
      } else {
        throw new Error(result.message || "Error al crear la categoría");
      }
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const startEditing = (categoria: Categoria) => {
    setEditingId(categoria.categoria_id);
    setEditValue(categoria.nombre_categoria);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleUpdateCategoria = async (id: number) => {
    if (!editValue.trim()) {
      setError("El nombre de la categoría no puede estar vacío");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/categorias/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre_categoria: editValue }),
        }
      );

      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        setEditingId(null);
        setEditValue("");
        setError(null);
        fetchCategorias();
      } else {
        throw new Error(result.message || "Error al actualizar la categoría");
      }
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const handleDeleteCategoria = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/categorias/${id}`,
        {
          method: "DELETE",
        }
      );

      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        fetchCategorias();
      } else {
        throw new Error(result.message || "Error al eliminar la categoría");
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
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

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <p>Cargando categorías...</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <li
                    key={categoria.categoria_id}
                    className="p-2 border-b flex justify-between items-center"
                  >
                    {editingId === categoria.categoria_id ? (
                      <div className="flex-grow flex items-center">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-grow p-2 border border-gray-300 rounded-lg mr-2"
                        />
                        <button
                          onClick={() =>
                            handleUpdateCategoria(categoria.categoria_id)
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 mr-2"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <span>{categoria.nombre_categoria}</span>
                        <div className="space-x-2">
                          <button
                            onClick={() => startEditing(categoria)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCategoria(categoria.categoria_id)
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                          >
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
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

export default CategoriasPage;
