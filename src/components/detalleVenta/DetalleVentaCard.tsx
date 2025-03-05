import { useState } from "react";
import DeleteDetalleVentaModal from "./DeleteDetalleVentaModal";
import { deleteDetalleVenta } from "app/app/api/detalleventa.api";

interface DetalleVenta {
  detalle_venta_id: number;
  venta: {
    venta_id: number;
    fecha: string;
    cliente: string;
  };
  producto: {
    producto_id: number;
    nombre: string;
    precio_unitario: number;
  };
  cantidad: number;
  subtotal: number;
}

interface DetalleVentaCardProps {
  detalleVenta: DetalleVenta;
  onDelete: () => void;
}

const DetalleVentaCard: React.FC<DetalleVentaCardProps> = ({
  detalleVenta,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteDetalleVenta(detalleVenta.detalle_venta_id);
    onDelete();
    setIsDeleting(false);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-lg font-bold">{detalleVenta.producto.nombre}</h2>
      <p className="text-gray-500">Venta ID: {detalleVenta.venta.venta_id}</p>
      <p className="text-gray-500">Cliente: {detalleVenta.venta.cliente}</p>
      <p className="text-gray-500">
        Fecha: {new Date(detalleVenta.venta.fecha).toLocaleString()}
      </p>
      <p className="text-gray-800 font-semibold">
        Precio Unitario: ${detalleVenta.producto.precio_unitario}
      </p>
      <p className="text-gray-500">Cantidad: {detalleVenta.cantidad}</p>
      <p className="text-gray-500">Subtotal: ${detalleVenta.subtotal}</p>

      <div className="flex justify-between mt-3">
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md"
          onClick={() => setIsDeleting(true)}
        >
          Eliminar
        </button>
      </div>

      {isDeleting && (
        <DeleteDetalleVentaModal
          onConfirm={handleDelete}
          onCancel={() => setIsDeleting(false)}
        />
      )}
    </div>
  );
};

export default DetalleVentaCard;
