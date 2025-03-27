"use client";
import { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import ProductForm from "app/components/productos/ProductForm";

interface Product {
  id: string;
  producto_id: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  stock: number;
  stock_minimo: number;
  stock_maximo: number;
  categoria: string;
  imagenUrl: string;
  proveedor: string;
  estado?: string;
}

const API_URL = "/api/productos";
//     ];

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      setProducts(
        data.map((p: any) => ({
          id: p.producto_id.toString(),
          producto_id: Number(p.producto_id) || 0,
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio_compra: Number(p.precio_compra) || 0,
          precio_venta: Number(p.precio_venta) || 0,
          stock: Number(p.stock) || 0,
          stock_minimo: Number(p.stock_minimo) || 0,
          stock_maximo: Number(p.stock_maximo) || 100,
          categoria: p.categoria || "Sin categoría",
          imagenUrl: p.imagenUrl || "/placeholder.png",
          proveedor: p.proveedor || "Sin proveedor",
          estado: p.estado || "activo",
        }))
      );
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) fetchProducts();
      else console.error("Error al eliminar el producto");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const headers = [
    "ID",
    "Imagen",
    "Nombre",
    "Descripción",
    "Precio Compra",
    "Precio Venta",
    "Stock",
    "Categoría",
    "Proveedor",
    "Acciones",
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>
        <ProductForm onProductAdded={fetchProducts} />
        {loading ? (
          <p className="text-gray-500">Cargando productos...</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 mt-6">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="divide-y">
                  <td>{product.producto_id}</td>
                  <td>
                    <img
                      src={product.imagenUrl}
                      alt={product.nombre}
                      className="h-10 w-10 rounded-full"
                    />
                  </td>
                  <td>{product.nombre}</td>
                  <td>{product.descripcion}</td>
                  <td>${product.precio_compra.toFixed(2)}</td>
                  <td>${product.precio_venta.toFixed(2)}</td>
                  <td>
                    {product.stock} / {product.stock_maximo}
                  </td>
                  <td>{product.categoria}</td>
                  <td>{product.proveedor}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default ProductsPage;
