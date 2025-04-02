import { useState } from "react";
import DeleteInventarioModal from "./DeleteInventarioModal";

interface Inventario {
  inventario_id: number;
  producto: {
    producto_id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    proveedor: string;
    precio_venta: number;
    imagenUrl?: string;
  };
  cantidad: number;
  fecha_actualizacion: string;
}

interface InventarioCardProps {
  inventario: Inventario;
  onDelete: () => void;
  onUpdate?: () => Promise<void>; // Prop opcional añadida
}

const InventarioCard: React.FC<InventarioCardProps> = ({
  inventario,
  onDelete,
  onUpdate,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/inventario/${inventario.inventario_id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el inventario");
      }

      onDelete();
      if (onUpdate) await onUpdate(); // Llama a onUpdate si existe
    } catch (error) {
      console.error("Error al eliminar el inventario:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800">
      <img
        src={inventario.producto.imagenUrl || "/placeholder.png"}
        alt={inventario.producto.nombre}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-lg font-bold mt-2">{inventario.producto.nombre}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {inventario.producto.descripcion}
      </p>
      <p className="text-gray-800 dark:text-gray-200 font-semibold">
        Precio Venta: ${inventario.producto.precio_venta}
      </p>
      <p className="text-gray-500 dark:text-gray-400">
        Categoría: {inventario.producto.categoria}
      </p>
      <p className="text-gray-500 dark:text-gray-400">
        Proveedor: {inventario.producto.proveedor}
      </p>
      <p className="text-gray-500 dark:text-gray-400">
        Cantidad Disponible: {inventario.cantidad}
      </p>
      <p className="text-gray-500 dark:text-gray-400">
        Última actualización:{" "}
        {new Date(inventario.fecha_actualizacion).toLocaleString()}
      </p>

      <div className="flex justify-between mt-3">
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md"
          onClick={() => setIsDeleting(true)}
        >
          Eliminar
        </button>
      </div>

      {isDeleting && (
        <DeleteInventarioModal
          onConfirm={handleDelete}
          onCancel={() => setIsDeleting(false)}
        />
      )}
    </div>
  );
};

export default InventarioCard;
