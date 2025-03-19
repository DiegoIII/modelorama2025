"use client";

import { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import InventarioForm from "app/components/inventario/InventarioForm";
import InventarioCard from "app/components/inventario/InventarioCard";
import { Inventario } from "@/types/inventario"; // Importa la interfaz

const InventarioPage = () => {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventario();
  }, []);

  // Función para obtener inventarios desde una API (ajustada según tu necesidad)
  const fetchInventario = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/inventarios"); // Ajusta la URL según tu API
      const data = await response.json();
      if (data.success) {
        setInventario(data.data); // Asumiendo que la respuesta tiene el formato adecuado
      } else {
        console.error("Error al obtener los inventarios");
      }
    } catch (error) {
      console.error("Error de red o de fetch:", error);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Inventario</h1>

        {/* Formulario para agregar inventario */}
        <InventarioForm onInventarioAdded={fetchInventario} />

        {/* Lista de inventario */}
        {loading ? (
          <p className="text-gray-500">Cargando inventario...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventario.map((item) => (
              <InventarioCard
                key={item.inventario_id}
                inventario={item}
                onDelete={fetchInventario}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InventarioPage;
