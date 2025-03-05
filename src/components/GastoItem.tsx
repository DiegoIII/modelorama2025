import React from "react";

interface Gasto {
  gasto_id: number;
  description: string;
  monto: number;
  categoriaGasto: {
    categoria_gasto_id: number;
    nombre: string;
  };
}

interface GastoItemProps {
  gasto: Gasto;
  onDelete: (id: number) => void;
}

const GastoItem: React.FC<GastoItemProps> = ({ gasto, onDelete }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {gasto.description}
          </h3>
          <p className="text-gray-600">Monto: ${gasto.monto}</p>
          <p className="text-gray-600">
            Categoría: {gasto.categoriaGasto.nombre}
          </p>
        </div>
        <button
          onClick={() => onDelete(gasto.gasto_id)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default GastoItem;
