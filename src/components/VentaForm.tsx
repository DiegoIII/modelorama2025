import React, { useState } from "react";

interface DetalleVenta {
  producto_id: number;
  cantidad: number;
  precio: number;
}

interface VentaFormProps {
  onSubmit: (venta: {
    total_venta: number;
    detalles: DetalleVenta[];
  }) => Promise<void>;
}

const VentaForm: React.FC<VentaFormProps> = ({ onSubmit }) => {
  const [totalVenta, setTotalVenta] = useState<number>(0);
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({ total_venta: totalVenta, detalles });
    } catch (error) {
      console.error("Error al crear la venta:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Total Venta
        </label>
        <input
          type="number"
          value={totalVenta}
          onChange={(e) => setTotalVenta(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Crear Venta
        </button>
      </div>
    </form>
  );
};

export default VentaForm;
