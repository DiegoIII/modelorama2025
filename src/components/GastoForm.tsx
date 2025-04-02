"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface CategoriaGasto {
  categoria_gasto_id: number;
  nombre_categoria_gasto: string;
}

interface GastoFormProps {
  onSubmit: SubmitHandler<any>;
  loading?: boolean;
}

interface ApiResponse {
  success: boolean;
  data: CategoriaGasto[];
  message?: string;
}

const GastoForm: React.FC<GastoFormProps> = ({ onSubmit, loading }) => {
  const { register, handleSubmit, reset } = useForm();
  const [categorias, setCategorias] = useState<CategoriaGasto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("/api/categorias-gastos");

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setCategorias(result.data);
        } else {
          throw new Error(result.message || "Estructura de datos inesperada");
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setError("No se pudieron cargar las categorías");
        setCategorias([]);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <input
          {...register("descripcion", { required: true })}
          type="text"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Monto</label>
        <input
          {...register("monto", { required: true, valueAsNumber: true })}
          type="number"
          step="0.01"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha</label>
        <input
          {...register("fecha", { required: true })}
          type="date"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          {...register("categoria_gasto_id", { required: true })}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Seleccione una categoría</option>
          {Array.isArray(categorias) &&
            categorias.map((categoria) => (
              <option
                key={categoria.categoria_gasto_id}
                value={categoria.categoria_gasto_id}
              >
                {categoria.nombre_categoria_gasto}
              </option>
            ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Procesando..." : "Guardar Gasto"}
      </button>
    </form>
  );
};

export default GastoForm;
