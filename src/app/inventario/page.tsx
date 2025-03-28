"use client";

import { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import InventarioForm from "app/components/inventario/InventarioForm";
import InventarioCard from "app/components/inventario/InventarioCard";
import type { Inventario as InventarioType } from "../../types/inventario";

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
    fetchInventario(); // Refresh the inventory list after adding a new item
  };

  return (
    <Layout>
      <div>
        {loading ? (
          <p>Cargando inventario...</p>
        ) : (
          <div>
            <InventarioForm onInventarioAdded={handleInventarioAdded} />
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
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InventarioPage;
