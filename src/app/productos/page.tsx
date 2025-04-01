"use client";
import { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import ProductForm from "app/components/productos/ProductForm";
import Image from "next/image";

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

interface ApiProduct {
  producto_id: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  stock_minimo: number;
  stock_maximo: number;
  categoria: string;
  imagenUrl: string;
  proveedor: string;
  estado?: string;
}

const API_URL = "/api/productos";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(
    undefined
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = (await res.json()) as ApiProduct[];
      setProducts(
        data.map((p) => ({
          id: p.producto_id.toString(),
          producto_id: Number(p.producto_id) || 0,
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio_compra: Number(p.precio_compra) || 0,
          precio_venta: Number(p.precio_venta) || 0,
          stock: 0, // Puedes calcular o agregar stock si lo manejas en otra tabla (por ej. inventario)
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

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
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
        <ProductForm
          onProductAdded={fetchProducts}
          productToEdit={productToEdit}
        />
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
                    <Image
                      src={product.imagenUrl}
                      alt={product.nombre}
                      width={40}
                      height={40}
                      className="rounded-full"
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
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
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
