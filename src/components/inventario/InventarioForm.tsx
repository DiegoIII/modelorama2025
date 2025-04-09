"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faPlus,
  faSpinner,
  faExclamationTriangle,
  faBoxOpen,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";

interface Product {
  producto_id: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  categoria: string;
  proveedor: string;
  imagenUrl?: string;
  stock_actual?: number;
}

interface InventarioFormProps {
  onInventarioAdded: () => void;
}

const InventarioForm = ({ onInventarioAdded }: InventarioFormProps) => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [apiError, setApiError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setApiError(false);
        const response = await fetch("/api/productos");

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || typeof data !== "object") {
          throw new Error("La respuesta no es un objeto válido");
        }

        let productsArray = [];
        if (Array.isArray(data)) {
          productsArray = data;
        } else if (Array.isArray(data.data)) {
          productsArray = data.data;
        } else if (Array.isArray(data.productos)) {
          productsArray = data.productos;
        } else {
          throw new Error("Formato de datos no reconocido");
        }

        setProductos(productsArray);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setApiError(true);
        setError(
          error instanceof Error
            ? error.message
            : "Error desconocido al cargar productos"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    if (productoId) {
      const product = productos.find(
        (p) => p.producto_id === parseInt(productoId)
      );
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [productoId, productos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!productoId || !cantidad) {
      setError("Todos los campos son obligatorios");
      setIsSubmitting(false);
      return;
    }

    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      setError("La cantidad debe ser un número positivo");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/inventario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          producto_id: parseInt(productoId),
          cantidad: cantidadNum,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al agregar al inventario");
      }

      onInventarioAdded();
      setProductoId("");
      setCantidad("");
      setSelectedProduct(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-[#F2B705]">
      <h2 className="text-xl font-semibold mb-4 text-[#032059] flex items-center">
        <FontAwesomeIcon icon={faBoxes} className="mr-2 text-[#F2B705]" />
        Agregar al Inventario
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          {error}
        </div>
      )}

      {apiError && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg flex items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          No se pudieron cargar los productos. Por favor, intente recargar la
          página.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[#031D40] mb-1 flex items-center">
            <FontAwesomeIcon icon={faBoxOpen} className="mr-2 text-[#F2B705]" />
            Producto
          </label>
          {loading ? (
            <div className="flex items-center text-[#032059]">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              <span>Cargando productos...</span>
            </div>
          ) : apiError ? (
            <p className="text-sm text-red-500">
              Error al cargar los productos. Intente nuevamente más tarde.
            </p>
          ) : productos.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay productos disponibles. Crea primero un producto.
            </p>
          ) : (
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
              required
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.producto_id} value={producto.producto_id}>
                  {producto.nombre} - {producto.categoria} (
                  {formatCurrency(producto.precio_venta)})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-[#031D40] mb-1 flex items-center">
            <FontAwesomeIcon icon={faHashtag} className="mr-2 text-[#F2B705]" />
            Cantidad
          </label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
            placeholder="Ingrese la cantidad"
            min="1"
            required
          />
        </div>

        {selectedProduct && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-[#032059]">
              Información del Producto:
            </h4>
            <p className="text-sm">Categoría: {selectedProduct.categoria}</p>
            <p className="text-sm">Proveedor: {selectedProduct.proveedor}</p>
            <p className="text-sm">
              Precio Venta: {formatCurrency(selectedProduct.precio_venta)}
            </p>
            {selectedProduct.stock_actual !== undefined && (
              <p className="text-sm">
                Stock Actual: {selectedProduct.stock_actual}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={
            loading || isSubmitting || apiError || productos.length === 0
          }
          className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-[#032059] hover:bg-[#031D40] transition-colors ${
            loading || isSubmitting || apiError || productos.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              Procesando...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar al Inventario
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Función auxiliar para formatear moneda
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export default InventarioForm;
