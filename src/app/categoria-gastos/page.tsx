"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faSpinner,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface CategoriaGasto {
  categoria_gasto_id: number;
  nombre_categoria_gasto: string;
  created_at?: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

const CategoriasGastosPage: React.FC = () => {
  const [categorias, setCategorias] = useState<CategoriaGasto[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/categorias-gastos");
      const result: ApiResponse = await response.json();

      if (response.ok && result.success && result.data) {
        setCategorias(result.data);
      } else {
        throw new Error(result.message || "Error al cargar categorías");
      }
    } catch (error) {
      console.error("Error al obtener las categorías de gastos:", error);
      setError("No se pudieron cargar las categorías");
      setCategorias([]);
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
      const response = await fetch("/api/categorias-gastos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_categoria_gasto: nuevaCategoria }),
      });

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

  const startEditing = (categoria: CategoriaGasto) => {
    setEditingId(categoria.categoria_gasto_id);
    setEditValue(categoria.nombre_categoria_gasto);
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
      const response = await fetch(`/api/categorias-gastos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_categoria_gasto: editValue }),
      });

      const result = await response.json();

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
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?"))
      return;

    try {
      const response = await fetch(`/api/categorias-gastos/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <FontAwesomeIcon
            icon={faCoins}
            className="text-3xl mr-3 text-[#F2B705]"
          />
          <h1 className="text-3xl font-bold text-[#031D40]">
            Categorías de Gastos
          </h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#F2B705] mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#032059]"
              placeholder="Nombre de la nueva categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateCategoria()}
            />
            <button
              onClick={handleCreateCategoria}
              className="bg-[#032059] hover:bg-[#031D40] text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-4xl text-[#032059] mb-4"
            />
            <p className="text-lg text-[#031D40]">Cargando categorías...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {categorias.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {categorias.map((categoria) => (
                  <li
                    key={categoria.categoria_gasto_id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    {editingId === categoria.categoria_gasto_id ? (
                      <div className="flex flex-col md:flex-row gap-4">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#032059]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleUpdateCategoria(
                                categoria.categoria_gasto_id
                              )
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faSave} className="mr-2" />
                            Guardar
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-lg text-[#031D40]">
                          {categoria.nombre_categoria_gasto}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(categoria)}
                            className="bg-[#F2B705] hover:bg-[#e0a904] text-[#031D40] px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCategoria(
                                categoria.categoria_gasto_id
                              )
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No hay categorías de gastos registradas
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoriasGastosPage;
