"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faSpinner,
  faPlus,
  faBox,
  faCashRegister,
  faHashtag,
  faDollarSign,
  faCalculator,
  faEdit,
  faTrash,
  faTimes,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

interface DetalleVenta {
  detalle_venta_id: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  venta?: {
    venta_id: number;
    fecha_venta: string;
  };
  producto?: {
    producto_id: number;
    nombre_producto: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: DetalleVenta[];
  message?: string;
}

const DetalleVentasPage: React.FC = () => {
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [ventas, setVentas] = useState<any[]>([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    venta_id: "",
    producto_id: "",
    cantidad: 1,
    precio_unitario: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detalleToDelete, setDetalleToDelete] = useState<DetalleVenta | null>(
    null
  );
  const [detalleToEdit, setDetalleToEdit] = useState<DetalleVenta | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchDetalleVentas();
    fetchProductos();
    fetchVentas();
  }, []);

  const fetchDetalleVentas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/detalle-ventas");
      const result: ApiResponse = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setDetalles(result.data);
      } else {
        throw new Error(result.message || "Estructura de datos inesperada");
      }
    } catch (error) {
      console.error("Error al obtener detalle de ventas:", error);
      setError("No se pudieron cargar los detalles de venta");
      setDetalles([]);
    } finally {
      setLoading(false);
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
      console.error("Error al obtener productos:", error);
    }
  };

  const fetchVentas = async () => {
    try {
      const response = await fetch("/api/ventas");
      const data = await response.json();
      if (data.success) {
        setVentas(data.data);
      }
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  const handleCreateDetalleVenta = async () => {
    const { venta_id, producto_id, cantidad, precio_unitario } = nuevoDetalle;

    if (!venta_id || !producto_id || cantidad <= 0 || precio_unitario <= 0) {
      setError(
        "Todos los campos son obligatorios y deben ser valores positivos"
      );
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/detalle-ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venta_id: parseInt(venta_id),
          producto_id: parseInt(producto_id),
          cantidad,
          precio_unitario,
          subtotal: cantidad * precio_unitario,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNuevoDetalle({
          venta_id: "",
          producto_id: "",
          cantidad: 1,
          precio_unitario: 0,
        });
        setError(null);
        fetchDetalleVentas();
      } else {
        throw new Error(result.message || "Error al crear el detalle de venta");
      }
    } catch (error) {
      console.error("Error al crear detalle de venta:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateDetalleVenta = async () => {
    if (!detalleToEdit) return;

    const { venta_id, producto_id, cantidad, precio_unitario } = detalleToEdit;

    if (!venta_id || !producto_id || cantidad <= 0 || precio_unitario <= 0) {
      setError(
        "Todos los campos son obligatorios y deben ser valores positivos"
      );
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(
        `/api/detalle-ventas/${detalleToEdit.detalle_venta_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            venta_id: parseInt(venta_id.toString()),
            producto_id: parseInt(producto_id.toString()),
            cantidad,
            precio_unitario,
            subtotal: cantidad * precio_unitario,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setDetalleToEdit(null);
        setError(null);
        fetchDetalleVentas();
      } else {
        throw new Error(
          result.message || "Error al actualizar el detalle de venta"
        );
      }
    } catch (error) {
      console.error("Error al actualizar detalle de venta:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteDetalleVenta = async () => {
    if (!detalleToDelete) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `/api/detalle-ventas/${detalleToDelete.detalle_venta_id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setDetalleToDelete(null);
        fetchDetalleVentas();
      } else {
        throw new Error(
          result.message || "Error al eliminar el detalle de venta"
        );
      }
    } catch (error) {
      console.error("Error al eliminar detalle de venta:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(isNaN(value) ? 0 : value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Modal para editar detalle */}
        {detalleToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#032059]">
                    Editar Detalle de Venta #{detalleToEdit.detalle_venta_id}
                  </h3>
                  <button
                    onClick={() => setDetalleToEdit(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[#031D40] font-medium mb-2 flex items-center">
                      <FontAwesomeIcon icon={faCashRegister} className="mr-2" />
                      Venta
                    </label>
                    <select
                      className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                      value={detalleToEdit.venta_id}
                      onChange={(e) =>
                        setDetalleToEdit({
                          ...detalleToEdit,
                          venta_id: Number(e.target.value),
                        })
                      }
                    >
                      <option value="">Selecciona una venta</option>
                      {ventas.map((venta) => (
                        <option key={venta.venta_id} value={venta.venta_id}>
                          Venta #{venta.venta_id} -{" "}
                          {formatDate(venta.fecha_venta)}
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
                      className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                      value={detalleToEdit.producto_id}
                      onChange={(e) =>
                        setDetalleToEdit({
                          ...detalleToEdit,
                          producto_id: Number(e.target.value),
                        })
                      }
                    >
                      <option value="">Selecciona un producto</option>
                      {productos.map((producto) => (
                        <option
                          key={producto.producto_id}
                          value={producto.producto_id}
                        >
                          {producto.nombre_producto || producto.nombre}
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
                      className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                      placeholder="Cantidad"
                      min="1"
                      value={detalleToEdit.cantidad || ""}
                      onChange={(e) =>
                        setDetalleToEdit({
                          ...detalleToEdit,
                          cantidad: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-[#031D40] font-medium mb-2 flex items-center">
                      <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                      Precio Unitario
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      value={detalleToEdit.precio_unitario || ""}
                      onChange={(e) =>
                        setDetalleToEdit({
                          ...detalleToEdit,
                          precio_unitario: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setDetalleToEdit(null)}
                    className="px-4 py-2 border border-[#032059] text-[#032059] rounded-lg hover:bg-[#032059]/10 transition-colors"
                    disabled={isProcessing}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateDetalleVenta}
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
        {detalleToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#032059]">
                    Confirmar eliminación
                  </h3>
                  <button
                    onClick={() => setDetalleToDelete(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <p className="mb-4 text-[#031D40]">
                  ¿Estás seguro de eliminar el detalle de venta{" "}
                  <strong>#{detalleToDelete.detalle_venta_id}</strong>?
                </p>
                <p className="mb-4 text-[#031D40]">
                  Producto:{" "}
                  <strong>
                    {detalleToDelete.producto?.nombre_producto ||
                      `Producto #${detalleToDelete.producto_id}`}
                  </strong>
                </p>
                <p className="mb-6 text-sm text-red-600">
                  Esta acción no se puede deshacer y afectará el total de la
                  venta asociada.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDetalleToDelete(null)}
                    className="px-4 py-2 border border-[#032059] text-[#032059] rounded-lg hover:bg-[#032059]/10 transition-colors"
                    disabled={isProcessing}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteDetalleVenta}
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
            icon={faReceipt}
            className="text-3xl mr-3 text-[#F2B705]"
          />
          <h1 className="text-3xl font-bold text-[#031D40]">
            Detalle de Ventas
          </h1>
        </div>

        {/* Formulario de nuevo detalle */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-[#031D40]/20 mb-8">
          <h2 className="text-xl font-semibold text-[#032059] mb-4 flex items-center">
            <FontAwesomeIcon icon={faPlus} className="mr-2 text-[#F2B705]" />
            Nuevo Detalle de Venta
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faCashRegister} className="mr-2" />
                Venta
              </label>
              <select
                className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                value={nuevoDetalle.venta_id}
                onChange={(e) =>
                  setNuevoDetalle({ ...nuevoDetalle, venta_id: e.target.value })
                }
              >
                <option value="">Selecciona una venta</option>
                {ventas.map((venta) => (
                  <option key={venta.venta_id} value={venta.venta_id}>
                    Venta #{venta.venta_id} - {formatDate(venta.fecha_venta)}
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
                className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                value={nuevoDetalle.producto_id}
                onChange={(e) =>
                  setNuevoDetalle({
                    ...nuevoDetalle,
                    producto_id: e.target.value,
                  })
                }
              >
                <option value="">Selecciona un producto</option>
                {productos.map((producto) => (
                  <option
                    key={producto.producto_id}
                    value={producto.producto_id}
                  >
                    {producto.nombre_producto || producto.nombre}
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
                className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                placeholder="Cantidad"
                min="1"
                value={nuevoDetalle.cantidad || ""}
                onChange={(e) =>
                  setNuevoDetalle({
                    ...nuevoDetalle,
                    cantidad: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                Precio Unitario
              </label>
              <input
                type="number"
                className="w-full p-3 border border-[#031D40]/30 rounded-lg focus:ring-2 focus:ring-[#F2B705] focus:border-[#032059]"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                value={nuevoDetalle.precio_unitario || ""}
                onChange={(e) =>
                  setNuevoDetalle({
                    ...nuevoDetalle,
                    precio_unitario: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <button
            onClick={handleCreateDetalleVenta}
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
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Detalle
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Listado de detalles */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#031D40]/20">
          <div className="p-4 bg-[#032059] text-white flex items-center">
            <FontAwesomeIcon
              icon={faCalculator}
              className="mr-2 text-[#F2B705]"
            />
            <h2 className="text-xl font-semibold">Historial de Detalles</h2>
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
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faHashtag} className="mr-1" /> ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faCashRegister} className="mr-1" />{" "}
                      Venta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faBox} className="mr-1" /> Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faHashtag} className="mr-1" />{" "}
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faDollarSign} className="mr-1" />{" "}
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      <FontAwesomeIcon icon={faCalculator} className="mr-1" />{" "}
                      Subtotal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#031D40] uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detalles.length > 0 ? (
                    detalles.map((detalle) => (
                      <tr
                        key={detalle.detalle_venta_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {detalle.detalle_venta_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          Venta #{detalle.venta_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {detalle.producto?.nombre_producto ||
                            `Producto #${detalle.producto_id}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {detalle.cantidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#031D40]">
                          {formatCurrency(detalle.precio_unitario)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#032059]">
                          {formatCurrency(detalle.subtotal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setDetalleToEdit(detalle)}
                              className="text-[#F2B705] hover:text-[#e0a904] transition-colors"
                              aria-label="Editar detalle"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => setDetalleToDelete(detalle)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              aria-label="Eliminar detalle"
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
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-[#031D40]/70"
                      >
                        No hay detalles de venta registrados
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

export default DetalleVentasPage;
