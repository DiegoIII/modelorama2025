"use client";

import { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import ProductForm from "app/components/productos/ProductForm";
import ProductCard from "app/components/productos/ProductCard";
import { Product } from "@/types/products";

const API_URL = "/api/products"; // Ajusta la URL según tu backend

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
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: parseFloat(product.precio),
        stock: parseInt(product.stock, 10),
        categoria: product.categoria,
        imagenUrl: product.imagenUrl || "/placeholder.png",
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error(error);
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
