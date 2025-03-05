import { useState } from "react";

interface InventarioFormProps {
  onInventarioAdded: () => void;
}

const InventarioForm: React.FC<InventarioFormProps> = ({
  onInventarioAdded,
}) => {
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/inventario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ producto, cantidad }),
      });

      if (!response.ok) throw new Error("Error agregando inventario");

      setProducto("");
      setCantidad(0);
      onInventarioAdded();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-md">
      <h2 className="text-lg font-bold mb-2">Agregar Inventario</h2>
      <div className="mb-2">
        <label className="block text-gray-700">Producto:</label>
        <input
          type="text"
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">Cantidad:</label>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
};

export default InventarioForm;
