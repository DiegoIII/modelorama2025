"use client";

import React, { useEffect, useState } from "react";
import VentaForm from "app/components/VentaForm";
import VentasList from "app/components/VentasList";
import Layout from "app/layout/Layout";

interface DetalleVenta {
  producto_id: number;
  cantidad: number;
  precio: number;
}

interface Venta {
  venta_id: number;
  total_venta: number;
  detalles: DetalleVenta[];
}

const VentasPage: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/ventas");
      const data = await response.json();
      setVentas(data);
    } catch (error) {
      console.error("Error fetching ventas:", error);
    }
  };

  const handleCreateVenta = async (venta: {
    total_venta: number;
    detalles: DetalleVenta[];
  }) => {
    try {
      await fetch("http://localhost:3000/api/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venta),
      });
      // Refrescar la lista de ventas después de crear una nueva
      window.location.reload();
    } catch (error) {
      console.error("Error creating venta:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestión de Ventas
        </h1>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <VentaForm onSubmit={handleCreateVenta} />
        </div>
        <div className="mt-8">
          <VentasList ventas={ventas} />
        </div>
      </div>
    </Layout>
  );
};

export default VentasPage;
