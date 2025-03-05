"use client";

import { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import DetalleVentaForm from "app/components/detalleVenta/DetalleVentaForm";
import DetalleVentaCard from "app/components/detalleVenta/DetalleVentaCard";
import { getDetalleVentas } from "../api/detalleventa.api";
import { DetalleVenta } from "@/types/detalleVenta";

const DetalleVentaPage = () => {
  const [detalleVentas, setDetalleVentas] = useState<DetalleVenta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetalleVentas();
  }, []);

  const fetchDetalleVentas = async () => {
    setLoading(true);
    const response = await getDetalleVentas();
    if (response.success) {
      setDetalleVentas(response.data);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          Gestión de Detalles de Venta
        </h1>

        {/* Formulario para agregar detalles de venta */}
        <DetalleVentaForm onDetalleVentaAdded={fetchDetalleVentas} />

        {/* Lista de detalles de venta */}
        {loading ? (
          <p className="text-gray-500">Cargando detalles de venta...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {detalleVentas.map((detalleVenta) => (
              <DetalleVentaCard
                key={detalleVenta.detalle_venta_id}
                detalleVenta={detalleVenta}
                onDelete={fetchDetalleVentas}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DetalleVentaPage;
