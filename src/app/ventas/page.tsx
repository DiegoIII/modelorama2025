"use client";

import React, { useEffect, useState } from "react";
import VentaForm, { VentaFormData } from "app/components/VentaForm";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCashRegister,
  faSpinner,
  faPlus,
  faHistory,
  faEdit,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface DetalleVenta {
  producto_id: number;
  cantidad: number;
  precio: number;
  nombre_producto?: string;
}

interface Venta {
  venta_id: number;
  total_venta: number;
  fecha_venta: string;
  detalles: DetalleVenta[];
}

const VentasPage: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingVenta, setEditingVenta] = useState<Venta | null>(null);
  const [ventaToDelete, setVentaToDelete] = useState<Venta | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ventas");
      const res = await response.json();
      if (res.success) {
        setVentas(res.data);
      } else {
        throw new Error(res.message || "Error al cargar ventas");
      }
    } catch (error) {
      console.error("Error fetching ventas:", error);
      setError("No se pudieron cargar las ventas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVenta = async (venta: VentaFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venta),
      });
      if (!response.ok) throw new Error("Error al crear venta");
      fetchVentas();
    } catch (error) {
      console.error("Error creating venta:", error);
      setError(
        error instanceof Error ? error.message : "Error al registrar venta"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVenta = async (
    ventaId: number,
    updatedVenta: VentaFormData
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ventas/${ventaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVenta),
      });
      if (!response.ok) throw new Error("Error al actualizar venta");
      fetchVentas();
      setEditingVenta(null);
    } catch (error) {
      console.error("Error updating venta:", error);
      setError(
        error instanceof Error ? error.message : "Error al actualizar venta"
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteVenta = (venta: Venta) => {
    setVentaToDelete(venta);
  };

  const cancelDeleteVenta = () => {
    setVentaToDelete(null);
  };

  const handleDeleteVenta = async () => {
    if (!ventaToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/ventas/${ventaToDelete.venta_id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar venta");
      fetchVentas();
    } catch (error) {
      console.error("Error deleting venta:", error);
      setError(
        error instanceof Error ? error.message : "Error al eliminar venta"
      );
    } finally {
      setIsDeleting(false);
      setVentaToDelete(null);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(isNaN(value) ? 0 : value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Modal de confirmación para eliminar */}
        {ventaToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#032059]">
                    Confirmar eliminación
                  </h3>
                  <button
                    onClick={cancelDeleteVenta}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <p className="mb-4 text-[#031D40]">
                  ¿Estás seguro de eliminar la venta{" "}
                  <strong>#{ventaToDelete.venta_id}</strong> del{" "}
                  {formatDate(ventaToDelete.fecha_venta)} por un total de{" "}
                  {formatCurrency(ventaToDelete.total_venta)}?
                </p>
                <p className="mb-6 text-sm text-red-600">
                  Esta acción eliminará {ventaToDelete.detalles.length}{" "}
                  producto(s) asociado(s) y no se puede deshacer.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelDeleteVenta}
                    className="px-4 py-2 border border-[#032059] text-[#032059] rounded-lg hover:bg-[#032059]/10 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteVenta}
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
            icon={faCashRegister}
            className="text-3xl mr-3 text-[#F2B705]"
          />
          <h1 className="text-3xl font-bold text-[#031D40]">
            Gestión de Ventas
          </h1>
        </div>

        {/* Formulario de ventas */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-[#031D40]/20 mb-8">
          <h2 className="text-xl font-semibold text-[#032059] mb-4 flex items-center">
            <FontAwesomeIcon
              icon={editingVenta ? faEdit : faPlus}
              className="mr-2 text-[#F2B705]"
            />
            {editingVenta ? "Editar Venta" : "Registrar Nueva Venta"}
          </h2>
          <VentaForm
            onSubmit={
              editingVenta
                ? (venta) => handleUpdateVenta(editingVenta.venta_id, venta)
                : handleCreateVenta
            }
            initialData={
              editingVenta
                ? {
                    total_venta: editingVenta.total_venta,
                    detalles: editingVenta.detalles,
                  }
                : undefined
            }
            onCancel={() => setEditingVenta(null)}
          />

          {loading && (
            <div className="mt-4 flex items-center justify-center text-[#032059]">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              <span>Procesando venta...</span>
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Listado de ventas */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#031D40]/20">
          <div className="p-4 bg-[#032059] text-white flex items-center">
            <FontAwesomeIcon icon={faHistory} className="mr-2 text-[#F2B705]" />
            <h2 className="text-xl font-semibold">Historial de Ventas</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-4xl text-[#032059] mb-4"
              />
              <p className="text-lg text-[#031D40]">Cargando ventas...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : ventas.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {ventas.map((venta) => (
                <div
                  key={venta.venta_id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#032059]">
                        Venta #{venta.venta_id}
                      </h3>
                      <p className="text-sm text-[#031D40]/80">
                        {formatDate(venta.fecha_venta)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#032059]">
                        {formatCurrency(venta.total_venta)}
                      </span>
                      <button
                        onClick={() => setEditingVenta(venta)}
                        className="text-[#F2B705] hover:text-[#e0a904] transition-colors"
                        aria-label="Editar venta"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => confirmDeleteVenta(venta)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label="Eliminar venta"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-[#031D40] mb-1">
                      Productos vendidos:
                    </h4>
                    <ul className="space-y-1">
                      {venta.detalles.map((detalle, index) => (
                        <li key={index} className="text-sm text-[#031D40]">
                          •{" "}
                          {detalle.nombre_producto ||
                            `Producto ${detalle.producto_id}`}{" "}
                          - Cantidad: {detalle.cantidad} - Precio:{" "}
                          {formatCurrency(detalle.precio)} - Subtotal:{" "}
                          {formatCurrency(detalle.cantidad * detalle.precio)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#031D40]/70">
              No hay ventas registradas
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VentasPage;
