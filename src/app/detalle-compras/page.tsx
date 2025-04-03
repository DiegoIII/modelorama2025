"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faSpinner,
  faPlus,
  faBox,
  faShoppingCart,
  faHashtag,
  faDollarSign,
  faCalculator,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import DetalleComprasCard from "app/components/detalle-compras/DetalleComprasCard";

interface DetalleCompra {
  detalle_compra_id: number;
  compra_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  compra?: {
    compra_id: number;
    fecha_compra: string;
    total_compra: number;
  };
  producto?: {
    producto_id: number;
    nombre: string;
    precio_venta: number;
  };
}

interface ApiResponse {
  success: boolean;
  data: DetalleCompra[];
  message?: string;
}

interface Producto {
  producto_id: number;
  nombre: string;
  precio_venta: number;
}

interface Compra {
  compra_id: number;
  fecha_compra: string;
  total_compra: number;
}

const DetalleComprasPage: React.FC = () => {
  const [detalles, setDetalles] = useState<DetalleCompra[]>([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    compra_id: 0,
    producto_id: 0,
    cantidad: 0,
    precio_unitario: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDetalles, setFilteredDetalles] = useState<DetalleCompra[]>([]);

  useEffect(() => {
    fetchDetalles();
    fetchCompras();
    fetchProductos();
  }, []);

  useEffect(() => {
    const filtered = detalles.filter((detalle) => {
      const matchesSearch =
        searchTerm === "" ||
        detalle.producto?.nombre
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        detalle.compra_id.toString().includes(searchTerm) ||
        detalle.detalle_compra_id.toString().includes(searchTerm);
      return matchesSearch;
    });
    setFilteredDetalles(filtered);
  }, [searchTerm, detalles]);

  const fetchDetalles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/detalle-compras");
      const result: ApiResponse = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setDetalles(result.data);
        setFilteredDetalles(result.data);
      } else {
        throw new Error(result.message || "Estructura de datos inesperada");
      }
    } catch (error) {
      console.error("Error al obtener los detalles:", error);
      setError("No se pudieron cargar los detalles de compra");
      setDetalles([]);
      setFilteredDetalles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompras = async () => {
    try {
      const response = await fetch("/api/compras");
      const data = await response.json();
      if (data.success) {
        setCompras(data.data);
      }
    } catch (error) {
      console.error("Error al obtener las compras:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch("/api/productos");
      const data = await response.json();
      if (data.success) {
        setProductos(data.data);
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const handleCreateDetalle = async () => {
    if (
      nuevoDetalle.compra_id <= 0 ||
      nuevoDetalle.producto_id <= 0 ||
      nuevoDetalle.cantidad <= 0 ||
      nuevoDetalle.precio_unitario <= 0
    ) {
      setError(
        "Todos los campos son obligatorios y deben ser valores positivos"
      );
      return;
    }

    try {
      const response = await fetch("/api/detalle-compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoDetalle),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNuevoDetalle({
          compra_id: 0,
          producto_id: 0,
          cantidad: 0,
          precio_unitario: 0,
        });
        setError(null);
        fetchDetalles();
      } else {
        throw new Error(
          result.message || "Error al crear el detalle de compra"
        );
      }
    } catch (error) {
      console.error("Error al crear el detalle de compra:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al crear el detalle"
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "producto_id") {
      const productoSeleccionado = productos.find(
        (p) => p.producto_id === Number(value)
      );
      setNuevoDetalle((prev) => ({
        ...prev,
        producto_id: Number(value),
        precio_unitario:
          productoSeleccionado?.precio_venta || prev.precio_unitario,
      }));
    } else {
      setNuevoDetalle((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    }
  };

  const handleDeleteDetalle = async (detalleId: number) => {
    try {
      const response = await fetch(`/api/detalle-compras/${detalleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDetalles(detalles.filter((d) => d.detalle_compra_id !== detalleId));
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      setError("Error al eliminar el detalle de compra");
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(isNaN(value) ? 0 : value);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <FontAwesomeIcon
              icon={faReceipt}
              className="text-3xl mr-3 text-[#F2B705]"
            />
            <h1 className="text-3xl font-bold text-[#031D40]">
              Detalle de Compras
            </h1>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#032059] focus:border-transparent"
              placeholder="Buscar detalles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Formulario de nuevo detalle */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#F2B705] mb-8">
          <h2 className="text-xl font-semibold text-[#032059] mb-4 flex items-center">
            <FontAwesomeIcon icon={faPlus} className="mr-2 text-[#F2B705]" />
            Nuevo Detalle de Compra
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Compra
              </label>
              <select
                name="compra_id"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                value={nuevoDetalle.compra_id || ""}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una compra</option>
                {compras.map((compra) => (
                  <option key={compra.compra_id} value={compra.compra_id}>
                    Compra #{compra.compra_id} -{" "}
                    {new Date(compra.fecha_compra).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faBox} className="mr-2" />
                Producto
              </label>
              <select
                name="producto_id"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                value={nuevoDetalle.producto_id || ""}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option
                    key={producto.producto_id}
                    value={producto.producto_id}
                  >
                    {producto.nombre} - {formatCurrency(producto.precio_venta)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faHashtag} className="mr-2" />
                Cantidad
              </label>
              <input
                type="number"
                name="cantidad"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                placeholder="Cantidad"
                min="1"
                value={nuevoDetalle.cantidad || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                Precio Unitario
              </label>
              <input
                type="number"
                name="precio_unitario"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                value={nuevoDetalle.precio_unitario || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              {nuevoDetalle.cantidad > 0 &&
                nuevoDetalle.precio_unitario > 0 && (
                  <p className="text-lg font-semibold text-[#032059]">
                    Subtotal:{" "}
                    {formatCurrency(
                      nuevoDetalle.cantidad * nuevoDetalle.precio_unitario
                    )}
                  </p>
                )}
            </div>

            <button
              onClick={handleCreateDetalle}
              disabled={loading}
              className="bg-[#032059] hover:bg-[#031D40] text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors w-full md:w-auto"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Agregar Detalle
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Listado de detalles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faCalculator}
                className="text-[#F2B705] mr-3"
              />
              <h2 className="text-2xl font-bold text-[#031D40]">
                Detalles Registrados
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Mostrando {filteredDetalles.length} de {detalles.length} detalles
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-4xl text-[#032059] mb-4"
              />
              <p className="text-lg text-[#031D40]">Cargando detalles...</p>
            </div>
          ) : filteredDetalles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDetalles.map((detalle) => (
                <DetalleComprasCard
                  key={detalle.detalle_compra_id}
                  detalle={detalle}
                  onDelete={() =>
                    handleDeleteDetalle(detalle.detalle_compra_id)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-blue-50 rounded-lg">
              {searchTerm ? (
                <>
                  <p className="text-lg text-[#032059]">
                    No se encontraron detalles que coincidan con la búsqueda
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                <p className="text-lg text-[#032059]">
                  No hay detalles de compra registrados
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DetalleComprasPage;
