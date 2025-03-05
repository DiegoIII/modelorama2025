import { useEffect, useState } from "react";

type Inventario = {
  inventario_id: number;
  producto: {
    producto_id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    proveedor: string;
    precio_venta: number;
  };
  cantidad: number;
  fecha_actualizacion: string;
};

const InventarioPage = () => {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Obtener inventario desde la API
  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/inventario");
        const data = await response.json();
        setInventario(data);
      } catch (error) {
        console.error("Error fetching inventario:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventario();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Inventario</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {inventario.map((item) => (
          <div
            key={item.inventario_id}
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold">{item.producto.nombre}</h2>
            <p className="text-gray-700">{item.producto.descripcion}</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Categoría: {item.producto.categoria}
              </p>
              <p className="text-sm text-gray-500">
                Proveedor: {item.producto.proveedor}
              </p>
              <p className="font-bold mt-2">
                Precio de Venta: ${item.producto.precio_venta}
              </p>
              <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
              <p className="text-sm text-gray-500">
                Última actualización:{" "}
                {new Date(item.fecha_actualizacion).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventarioPage;
