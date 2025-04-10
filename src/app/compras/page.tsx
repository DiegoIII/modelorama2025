"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSpinner,
  faPlus,
  faBoxOpen,
  faCalendarAlt,
  faDollarSign,
  faIdCard,
  faEdit,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface Proveedor {
  proveedor_id: number;
  nombre_proveedor: string;
}

interface Compra {
  compra_id: number;
  proveedor_id: number;
  fecha_compra: string;
  total_compra: number | string;
  proveedor?: Proveedor;
  detalleCompras?: Array<{
    detalle_compra_id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    producto?: {
      nombre_producto: string;
    };
  }>;
}

interface ApiResponse {
  success: boolean;
  data: Compra[];
  message?: string;
}

const ComprasPage: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [nuevaCompra, setNuevaCompra] = useState({
    proveedor_id: 0,
    fecha_compra: "",
    total_compra: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compraToEdit, setCompraToEdit] = useState<Compra | null>(null);
  const [compraToDelete, setCompraToDelete] = useState<Compra | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/compras");
      const result: ApiResponse = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const comprasFormateadas = result.data.map((compra) => ({
          ...compra,
          total_compra:
            typeof compra.total_compra === "string"
              ? parseFloat(compra.total_compra)
              : compra.total_compra,
        }));
        setCompras(comprasFormateadas);
      } else {
        throw new Error(result.message || "Estructura de datos inesperada");
      }
    } catch (error) {
      console.error("Error al obtener las compras:", error);
      setError("No se pudieron cargar las compras");
      setCompras([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompra = async () => {
    if (!nuevaCompra.fecha_compra.trim() || nuevaCompra.proveedor_id <= 0) {
      setError("Proveedor y fecha son obligatorios");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proveedor_id: nuevaCompra.proveedor_id,
          fecha_compra: nuevaCompra.fecha_compra,
          total_compra: parseFloat(nuevaCompra.total_compra.toString()),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNuevaCompra({ proveedor_id: 0, fecha_compra: "", total_compra: 0 });
        setError(null);
        fetchCompras();
      } else {
        throw new Error(result.message || "Error al crear la compra");
      }
    } catch (error) {
      console.error("Error al crear la compra:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateCompra = async () => {
    if (!compraToEdit) return;
    if (!compraToEdit.fecha_compra.trim() || compraToEdit.proveedor_id <= 0) {
      setError("Proveedor y fecha son obligatorios");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/compras/${compraToEdit.compra_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proveedor_id: compraToEdit.proveedor_id,
          fecha_compra: compraToEdit.fecha_compra,
          total_compra: parseFloat(compraToEdit.total_compra.toString()),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCompraToEdit(null);
        setError(null);
        fetchCompras();
      } else {
        throw new Error(result.message || "Error al actualizar la compra");
      }
    } catch (error) {
      console.error("Error al actualizar la compra:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCompra = async () => {
    if (!compraToDelete) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/compras/${compraToDelete.compra_id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCompraToDelete(null);
        fetchCompras();
      } else {
        throw new Error(result.message || "Error al eliminar la compra");
      }
    } catch (error) {
      console.error("Error al eliminar la compra:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevaCompra((prev) => ({
      ...prev,
      [name]:
        name === "proveedor_id" || name === "total_compra"
          ? Number(value)
          : value,
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!compraToEdit) return;
    const { name, value } = e.target;
    setCompraToEdit({
      ...compraToEdit,
      [name]:
        name === "proveedor_id" || name === "total_compra"
          ? Number(value)
          : value,
    });
  };

  const formatCurrency = (value: number | string): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(isNaN(num) ? 0 : num);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Modal para editar compra */}
        {compraToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#032059]">
                    Editar Compra #{compraToEdit.compra_id}
                  </h3>
                  <button
                    onClick={() => setCompraToEdit(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[#031D40] font-medium mb-2 flex items-center">
                      <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                      ID Proveedor
                    </label>
                    <input
                      type="number"
                      name="proveedor_id"
                      className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                      placeholder="ID del proveedor"
                      value={compraToEdit.proveedor_id || ""}
                      onChange={handleEditInputChange}
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="text-[#031D40] font-medium mb-2 flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      Fecha Compra
                    </label>
                    <input
                      type="date"
                      name="fecha_compra"
                      className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                      value={compraToEdit.fecha_compra}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[#031D40] font-medium mb-2 flex items-center">
                      <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                      Total Compra
                    </label>
                    <input
                      type="number"
                      name="total_compra"
                      className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={compraToEdit.total_compra || ""}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setCompraToEdit(null)}
                    className="px-4 py-2 border border-[#032059] text-[#032059] rounded-lg hover:bg-[#032059]/10 transition-colors"
                    disabled={isProcessing}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateCompra}
                    className={`px-4 py-2 bg-[#F2B705] text-[#032059] rounded-lg hover:bg-[#F2B705]/90 transition-colors ${
                      isProcessing ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          className="mr-2"
                        />
                        Actualizando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal para confirmar eliminación */}
        {compraToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#032059]">
                    Confirmar Eliminación
                  </h3>
                  <button
                    onClick={() => setCompraToDelete(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <p className="mb-4 text-[#031D40]">
                  ¿Estás seguro de eliminar la compra{" "}
                  <strong>#{compraToDelete.compra_id}</strong> del{" "}
                  {formatDate(compraToDelete.fecha_compra)} por un total de{" "}
                  {formatCurrency(compraToDelete.total_compra)}?
                </p>
                <p className="mb-6 text-sm text-red-600">
                  Esta acción no se puede deshacer y eliminará todos los
                  detalles asociados.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setCompraToDelete(null)}
                    className="px-4 py-2 border border-[#032059] text-[#032059] rounded-lg hover:bg-[#032059]/10 transition-colors"
                    disabled={isProcessing}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteCompra}
                    className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
                      isProcessing ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          className="mr-2"
                        />
                        Eliminando...
                      </>
                    ) : (
                      "Eliminar Definitivamente"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center mb-8">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-3xl mr-3 text-[#F2B705]"
          />
          <h1 className="text-3xl font-bold text-[#031D40]">
            Gestión de Compras
          </h1>
        </div>

        {/* Formulario de nueva compra */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-[#031D40]/20 mb-8">
          <h2 className="text-xl font-semibold text-[#032059] mb-4 flex items-center">
            <FontAwesomeIcon icon={faPlus} className="mr-2 text-[#F2B705]" />
            Registrar Nueva Compra
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                ID Proveedor
              </label>
              <input
                type="number"
                name="proveedor_id"
                className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                placeholder="ID del proveedor"
                value={nuevaCompra.proveedor_id || ""}
                onChange={handleInputChange}
                min="1"
              />
            </div>

            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Fecha Compra
              </label>
              <input
                type="date"
                name="fecha_compra"
                className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                value={nuevaCompra.fecha_compra}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                Total Compra
              </label>
              <input
                type="number"
                name="total_compra"
                className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={nuevaCompra.total_compra || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            onClick={handleCreateCompra}
            disabled={isProcessing}
            className={`bg-[#032059] hover:bg-[#031D40] text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors w-full md:w-auto ${
              isProcessing ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Procesando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Registrar Compra
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Listado de compras */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#031D40]/20">
          <div className="p-4 bg-[#032059] text-white flex items-center">
            <FontAwesomeIcon icon={faBoxOpen} className="mr-2 text-[#F2B705]" />
            <h2 className="text-xl font-semibold">Historial de Compras</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-4xl text-[#032059] mb-4"
              />
              <p className="text-lg text-[#031D40]">Cargando compras...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {compras.length > 0 ? (
                    compras.map((compra) => (
                      <tr
                        key={compra.compra_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {compra.compra_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {compra.proveedor?.nombre_proveedor ||
                            `Proveedor #${compra.proveedor_id}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {formatDate(compra.fecha_compra)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#032059]">
                          {formatCurrency(compra.total_compra)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setCompraToEdit(compra)}
                              className="text-[#F2B705] hover:text-[#e0a904] transition-colors"
                              aria-label="Editar compra"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => setCompraToDelete(compra)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              aria-label="Eliminar compra"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-[#031D40]/70"
                      >
                        No hay compras registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ComprasPage;
