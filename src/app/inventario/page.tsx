"use client";

import { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import InventarioForm from "app/components/inventario/InventarioForm";
import InventarioCard from "app/components/inventario/InventarioCard";
import type { Inventario as InventarioType } from "../../types/inventario";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faSpinner,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

export interface LocalInventario {
  inventario_id: number;
  producto: {
    producto_id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    proveedor: string;
    precio_venta: number;
    imagenUrl: string;
  };
  cantidad: number;
  fecha_actualizacion: string;
}

const InventarioPage = () => {
  const [inventario, setInventario] = useState<LocalInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/inventario");
      const data = await response.json();
      if (data.success) {
        setInventario(
          data.data.map((item: any) => ({
            inventario_id: item.inventario_id,
            producto: {
              producto_id: item.producto_id,
              nombre: item.nombre,
              descripcion: item.descripcion,
              categoria: item.categoria,
              proveedor: item.proveedor,
              precio_venta: item.precio_venta,
              imagenUrl: item.imagenUrl,
            },
            cantidad: item.cantidad,
            fecha_actualizacion: item.fecha_actualizacion,
          }))
        );
      } else {
        console.error("Error al obtener los inventarios");
      }
    } catch (error) {
      console.error("Error de red o de fetch:", error);
    }
    setLoading(false);
  };

  const handleInventarioAdded = () => {
    fetchInventario();
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#031D40] flex items-center">
            <FontAwesomeIcon icon={faBoxes} className="mr-3 text-[#F2B705]" />
            Gestión de Inventario
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#032059] hover:bg-[#031D40] text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            {showForm ? "Cancelar" : "Agregar Producto"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-[#F2B705]">
            <h2 className="text-xl font-semibold mb-4 text-[#032059]">
              {inventario.length === 0
                ? "Registrar primer producto"
                : "Agregar nuevo producto"}
            </h2>
            <InventarioForm onInventarioAdded={handleInventarioAdded} />
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-4xl text-[#032059] mb-4"
            />
            <p className="text-lg text-[#031D40]">Cargando inventario...</p>
          </div>
        ) : (
          <div>
            {inventario.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <p className="text-lg text-[#032059]">
                  No hay productos registrados en el inventario. Comienza
                  agregando uno.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventario.map((item) => (
                  <InventarioCard
                    key={item.inventario_id}
                    inventario={item}
                    onDelete={() => {
                      setInventario((prev) =>
                        prev.filter(
                          (inv) => inv.inventario_id !== item.inventario_id
                        )
                      );
                    }}
                    onUpdate={fetchInventario}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InventarioPage;
