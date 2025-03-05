import React, { useEffect, useState } from "react";
import GastoItem from "./GastoItem";

interface Gasto {
  gasto_id: number;
  description: string;
  monto: number;
  categoriaGasto: {
    categoria_gasto_id: number;
    nombre: string;
  };
}

const GastosList: React.FC = () => {
  const [gastos, setGastos] = useState<Gasto[]>([]);

  useEffect(() => {
    fetchGastos();
  }, []);

  const fetchGastos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/gastos");
      const data = await response.json();
      setGastos(data);
    } catch (error) {
      console.error("Error fetching gastos:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/gastos/${id}`, {
        method: "DELETE",
      });
      fetchGastos(); // Refrescar la lista después de eliminar
    } catch (error) {
      console.error("Error deleting gasto:", error);
    }
  };

  return (
    <div className="space-y-6">
      {gastos.map((gasto) => (
        <GastoItem key={gasto.gasto_id} gasto={gasto} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default GastosList;
