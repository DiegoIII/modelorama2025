"use client";
import { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import ProductForm from "app/components/productos/ProductForm";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faSpinner,
  faEdit,
  faTrash,
  faHashtag,
  faImage,
  faTag,
  faAlignLeft,
  faDollarSign,
  faBoxes,
  faList,
  faTruck,
  faCog,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

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
  proveedor: string;
  imagenUrl: string;
}

const API_URL = "/api/productos";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(
    undefined
  );
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = (await res.json()) as {
        success: boolean;
        data: ApiProduct[];
      };
      if (data.success) {
        setProducts(
          data.data.map((p) => ({
            id: p.producto_id.toString(),
            producto_id: Number(p.producto_id) || 0,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio_compra: Number(p.precio_compra) || 0,
            precio_venta: Number(p.precio_venta) || 0,
            stock: 0,
            stock_minimo: Number(p.stock_minimo) || 0,
            stock_maximo: Number(p.stock_maximo) || 100,
            categoria: p.categoria || "Sin categoría",
            imagenUrl:
              p.imagenUrl && p.imagenUrl.trim() !== ""
                ? p.imagenUrl
                : "/No_Image_Available.jpg",
            proveedor: p.proveedor || "Sin proveedor",
            estado: "activo",
          }))
        );
      } else {
        throw new Error("Error en la respuesta del API");
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setError("No se pudieron cargar los productos");
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (product: Product) => {
    setProductToDelete(product);
  };

  const handleDeleteCancel = () => {
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/${productToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(
          responseData.message || "Producto eliminado correctamente"
        );
        fetchProducts();
      } else {
        throw new Error(
          responseData.message || "Error al eliminar el producto"
        );
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido al eliminar";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(isNaN(value) ? 0 : value);
  };

  const headers = [
    { name: "ID", icon: faHashtag },
    { name: "Imagen", icon: faImage },
    { name: "Nombre", icon: faTag },
    { name: "Descripción", icon: faAlignLeft },
    { name: "P. Compra", icon: faDollarSign },
    { name: "P. Venta", icon: faDollarSign },
    { name: "Stock", icon: faBoxes },
    { name: "Categoría", icon: faList },
    { name: "Proveedor", icon: faTruck },
    { name: "Acciones", icon: faCog },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Modal de confirmación para eliminar */}
        {productToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#032059]">
                    Confirmar eliminación
                  </h3>
                  <button
                    onClick={handleDeleteCancel}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={productToDelete.imagenUrl}
                      alt={productToDelete.nombre}
                      fill
                      className="rounded-md object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-product.png";
                      }}
                    />
                  </div>
                  <div>
                    <p className="mb-4 text-[#031D40]">
                      ¿Estás seguro de eliminar el producto{" "}
                      <strong>{productToDelete.nombre}</strong> (ID:{" "}
                      {productToDelete.producto_id})?
                    </p>
                  </div>
                </div>
                <p className="mb-6 text-sm text-red-600">
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleDeleteCancel}
                    className="px-4 py-2 border border-[#032059] text-[#032059] rounded-lg hover:bg-[#032059]/10 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
                      isDeleting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          className="mr-2"
                        />
                        Eliminando...
                      </>
                    ) : (
                      "Eliminar definitivamente"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center mb-8">
          <FontAwesomeIcon
            icon={faBoxOpen}
            className="text-3xl mr-3 text-[#F2B705]"
          />
          <h1 className="text-3xl font-bold text-[#031D40]">
            Gestión de Productos
          </h1>
        </div>

        {/* Formulario de productos */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#F2B705] mb-8">
          <h2 className="text-xl font-semibold text-[#032059] mb-4">
            {productToEdit ? "Editar Producto" : "Agregar Nuevo Producto"}
          </h2>
          <ProductForm
            onProductAdded={() => {
              fetchProducts();
              setProductToEdit(undefined);
              toast.success("Producto guardado correctamente");
            }}
            productToEdit={productToEdit}
          />
        </div>

        {/* Listado de productos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-[#032059] text-white">
            <h2 className="text-xl font-semibold flex items-center">
              <FontAwesomeIcon icon={faBoxes} className="mr-2 text-[#F2B705]" />
              Listado de Productos
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-4xl text-[#032059] mb-4"
              />
              <p className="text-lg text-[#031D40]">Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((header) => (
                      <th
                        key={header.name}
                        className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider"
                      >
                        <FontAwesomeIcon icon={header.icon} className="mr-1" />
                        {header.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                        {product.producto_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative w-10 h-10">
                          <Image
                            src={product.imagenUrl}
                            alt={product.nombre}
                            fill
                            className="rounded-full object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-product.png";
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                        {product.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#031D40] max-w-xs truncate">
                        {product.descripcion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                        {formatCurrency(product.precio_compra)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#032059]">
                        {formatCurrency(product.precio_venta)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.stock < product.stock_minimo
                              ? "bg-red-100 text-red-800"
                              : product.stock > product.stock_maximo
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.stock} / {product.stock_maximo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                        {product.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                        {product.proveedor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-[#F2B705] hover:text-[#e0a904]"
                            aria-label="Editar producto"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(product)}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Eliminar producto"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
