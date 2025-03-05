import { useEffect, useState } from "react";

type DetalleVenta = {
  detalle_venta_id: number;
  venta: {
    venta_id: number;
    fecha: string;
    cliente: string;
  };
  producto: {
    producto_id: number;
    nombre: string;
    precio_venta: number;
  };
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
};

const DetalleVentaPage = () => {
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/detalle_ventas"
        );
        const data = await response.json();
        setDetalles(data);
      } catch (error) {
        console.error("Error fetching detalles de venta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalles();
  }, []);

  if (loading) {
    return <div>Cargando detalles de venta...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Detalles de Ventas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {detalles.map((detalle) => (
          <div
            key={detalle.detalle_venta_id}
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold">{detalle.producto.nombre}</h2>
            <p className="text-gray-700">Cantidad: {detalle.cantidad}</p>
            <p className="text-gray-700">
              Precio Unitario: ${detalle.precio_unitario}
            </p>
            <p className="text-gray-700">Subtotal: ${detalle.subtotal}</p>
            <p className="text-sm text-gray-500">
              Cliente: {detalle.venta.cliente}
            </p>
            <p className="text-sm text-gray-500">
              Fecha: {new Date(detalle.venta.fecha).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetalleVentaPage;
