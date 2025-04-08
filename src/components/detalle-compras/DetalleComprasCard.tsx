"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faBox,
  faHashtag,
  faDollarSign,
  faCalculator,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface DetalleCompra {
  detalle_compra_id: number;
  compra_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: {
    nombre: string;
    precio_venta?: number;
  };
}

interface DetalleComprasCardProps {
  detalle: DetalleCompra;
  onDelete: () => void;
}

const DetalleComprasCard: React.FC<DetalleComprasCardProps> = ({
  detalle,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white border-t-4 border-[#F2B705] hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faReceipt} className="text-[#032059] mr-2" />
          <h3 className="font-bold text-[#031D40]">
            Detalle #{detalle.detalle_compra_id}
          </h3>
        </div>
        <span className="text-sm bg-[#031D40] text-white px-2 py-1 rounded">
          Compra #{detalle.compra_id}
        </span>
      </div>

      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
            <FontAwesomeIcon icon={faBox} className="text-gray-400 text-xl" />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <h4 className="font-semibold text-[#032059]">
              {detalle.producto?.nombre || `Producto #${detalle.producto_id}`}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faHashtag}
                className="mr-1 text-[#F2B705]"
              />
              <span>Cantidad: {detalle.cantidad}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faDollarSign}
                className="mr-1 text-[#F2B705]"
              />
              <span>Precio: {formatCurrency(detalle.precio_unitario)}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faCalculator}
                className="mr-1 text-[#F2B705]"
              />
              <span className="font-bold">
                Subtotal: {formatCurrency(detalle.subtotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => setIsDeleting(true)}
          disabled={isDeleting}
          className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center hover:bg-red-700 transition-colors text-sm"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-1" />
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={() => {
          onDelete();
          setIsDeleting(false);
        }}
        title="Eliminar Detalle"
        message="¿Estás seguro de que deseas eliminar este detalle de compra?"
      />
    </div>
  );
};

export default DetalleComprasCard;
