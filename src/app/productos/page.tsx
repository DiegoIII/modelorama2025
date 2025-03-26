"use client";

import { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import ProductForm from "app/components/productos/ProductForm";
import ProductCard from "app/components/productos/ProductCard";

// Definición completa de la interfaz Product
interface Product {
  id: string;
  producto_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_compra: number;
  precio_venta: number;
  stock: number;
  stock_minimo: number;
  stock_maximo: number; // New property
  categoria: string;
  imagenUrl: string;
  proveedor: string; // New property
  estado?: string;
}

const API_URL = "/api/products";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener productos");

      const data = await response.json();
      const formattedProducts: Product[] = data.map((product: any) => ({
        id: product.id,
        producto_id: parseInt(product.producto_id || product.id, 10), // Convertir a number
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: parseFloat(product.precio),
        precio_compra: parseFloat(product.precio_compra || 0),
        precio_venta: parseFloat(product.precio_venta || product.precio),
        stock: parseInt(product.stock, 10),
        stock_minimo: parseInt(product.stock_minimo || 0, 10),
        categoria: product.categoria,
        imagenUrl: product.imagenUrl || "/placeholder.png",
        estado: product.estado || "activo",
        stock_maximo: parseInt(product.stock_maximo || 0, 10), // Add this line
        proveedor: product.proveedor || "Sin proveedor",
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>

        <ProductForm onProductAdded={fetchProducts} />

        {loading ? (
          <p className="text-gray-500">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={fetchProducts}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductsPage;
