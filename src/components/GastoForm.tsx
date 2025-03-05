import React, { useState } from "react";

interface CategoriaGasto {
  categoria_gasto_id: number;
  nombre: string;
}

interface GastoFormProps {
  onSubmit: (gasto: {
    description: string;
    monto: number;
    categoria_gasto_id: number;
  }) => void;
  categorias: CategoriaGasto[];
  initialData?: {
    gasto_id?: number;
    description: string;
    monto: number;
    categoria_gasto_id: number;
  };
}

const GastoForm: React.FC<GastoFormProps> = ({
  onSubmit,
  categorias,
  initialData,
}) => {
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [monto, setMonto] = useState(initialData?.monto || 0);
  const [categoriaGastoId, setCategoriaGastoId] = useState(
    initialData?.categoria_gasto_id || 1
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ description, monto, categoria_gasto_id: categoriaGastoId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Monto</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          value={categoriaGastoId}
          onChange={(e) => setCategoriaGastoId(Number(e.target.value))}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {categorias.map((categoria) => (
            <option
              key={categoria.categoria_gasto_id}
              value={categoria.categoria_gasto_id}
            >
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
      >
        {initialData ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
};

export default GastoForm;
