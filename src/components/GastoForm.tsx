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
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#031D40]">
          Descripción
        </label>
        <input
          {...register("descripcion", { required: true })}
          type="text"
          className="mt-1 block w-full px-4 py-2 border border-[#031D40]/30 rounded-lg shadow-sm focus:ring-[#F2B705] focus:border-[#032059] text-[#032059]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#031D40]">
          Monto
        </label>
        <input
          {...register("monto", { required: true, valueAsNumber: true })}
          type="number"
          step="0.01"
          className="mt-1 block w-full px-4 py-2 border border-[#031D40]/30 rounded-lg shadow-sm focus:ring-[#F2B705] focus:border-[#032059] text-[#032059]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#031D40]">
          Fecha
        </label>
        <input
          {...register("fecha", { required: true })}
          type="date"
          className="mt-1 block w-full px-4 py-2 border border-[#031D40]/30 rounded-lg shadow-sm focus:ring-[#F2B705] focus:border-[#032059] text-[#032059]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#031D40]">
          Categoría
        </label>
        <select
          {...register("categoria_gasto_id", { required: true })}
          className="mt-1 block w-full px-4 py-2 border border-[#031D40]/30 rounded-lg shadow-sm focus:ring-[#F2B705] focus:border-[#032059] text-[#032059]"
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
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#032059] hover:bg-[#031D40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F2B705] transition-colors duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Procesando...
          </span>
        ) : (
          "Guardar Gasto"
        )}
      </button>
    </form>
  );
};

export default GastoForm;
