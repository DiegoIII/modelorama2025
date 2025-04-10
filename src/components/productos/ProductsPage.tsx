import { useEffect, useState } from "react";

type Producto = {
  producto_id: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  stock_minimo: number;
  stock_maximo: number;
  categoria: string;
  proveedor: string;
};

const ProductosPage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/productos");
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error fetching productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.producto_id}
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold">{producto.nombre}</h2>
            <p className="text-gray-700">{producto.descripcion}</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Categoría: {producto.categoria}
              </p>
              <p className="text-sm text-gray-500">
                Proveedor: {producto.proveedor}
              </p>
              <p className="font-bold mt-2">
                Precio de Venta: ${producto.precio_venta}
              </p>
              <p className="text-sm text-gray-500">
                Stock Mínimo: {producto.stock_minimo}
              </p>
              <p className="text-sm text-gray-500">
                Stock Máximo: {producto.stock_maximo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosPage;
