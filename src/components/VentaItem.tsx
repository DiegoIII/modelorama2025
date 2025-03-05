import React from "react";

interface VentaItemProps {
  venta: {
    venta_id: number;
    total_venta: number;
    detalles: any[];
  };
}

const VentaItem: React.FC<VentaItemProps> = ({ venta }) => {
  return (
    <div className="p-4 mb-2 bg-white shadow rounded">
      <h2 className="text-xl font-semibold">Venta ID: {venta.venta_id}</h2>
      <p>Total: ${venta.total_venta}</p>
      <div className="mt-2">
        <h3 className="text-lg font-bold">Detalles:</h3>
        <ul>
          {venta.detalles.map((detalle, index) => (
            <li key={index} className="ml-4">
              Producto ID: {detalle.producto_id}, Cantidad: {detalle.cantidad},
              Precio: ${detalle.precio}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VentaItem;
