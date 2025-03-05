import { useState } from "react";

interface DetalleVentaFormProps {
  onDetalleVentaAdded: () => void;
}

const DetalleVentaForm: React.FC<DetalleVentaFormProps> = ({
  onDetalleVentaAdded,
}) => {
  const [ventaId, setVentaId] = useState<number | "">("");
  const [productoId, setProductoId] = useState<number | "">("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/detalle-venta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venta_id: ventaId,
          producto_id: productoId,
          cantidad,
          precio_unitario: precioUnitario,
          subtotal: cantidad * precioUnitario,
        }),
      });

      if (!response.ok) throw new Error("Error agregando detalle de venta");

      setVentaId("");
      setProductoId("");
      setCantidad(1);
      setPrecioUnitario(0);
      onDetalleVentaAdded();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-md">
      <h2 className="text-lg font-bold mb-2">Agregar Detalle de Venta</h2>

      <div className="mb-2">
        <label className="block text-gray-700">ID Venta:</label>
        <input
          type="number"
          value={ventaId}
          onChange={(e) => setVentaId(Number(e.target.value))}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700">ID Producto:</label>
        <input
          type="number"
          value={productoId}
          onChange={(e) => setProductoId(Number(e.target.value))}
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

      <div className="mb-2">
        <label className="block text-gray-700">Precio Unitario:</label>
        <input
          type="number"
          step="0.01"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(Number(e.target.value))}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Agregando..." : "Agregar Detalle"}
      </button>
    </form>
  );
};

export default DetalleVentaForm;
