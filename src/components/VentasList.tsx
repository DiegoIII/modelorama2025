import React from "react";

interface DetalleVenta {
  producto_id: number;
  cantidad: number;
  precio: number;
}

interface Venta {
  venta_id: number;
  total_venta: number;
  detalles: DetalleVenta[];
}

interface VentasListProps {
  ventas: Venta[];
}

const VentasList: React.FC<VentasListProps> = ({ ventas }) => {
  return (
    <div className="space-y-4">
      {ventas.map((venta) => (
        <div key={venta.venta_id} className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold">Venta ID: {venta.venta_id}</h2>
          <p>Total: ${venta.total_venta}</p>
          <div className="mt-2">
            <h3 className="text-md font-bold">Detalles:</h3>
            <ul>
              {venta.detalles.map((detalle, index) => (
                <li key={index} className="ml-4">
                  Producto ID: {detalle.producto_id}, Cantidad:{" "}
                  {detalle.cantidad}, Precio: ${detalle.precio}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VentasList;
