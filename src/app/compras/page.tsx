"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";

interface Compra {
  compra_id: number;
  proveedor_id: number;
  fecha_compra: string;
  total_compra: number;
}

const ComprasPage: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [nuevaCompra, setNuevaCompra] = useState({
    proveedor_id: 0,
    fecha_compra: "",
    total_compra: 0,
  });

  useEffect(() => {
    fetchCompras();
  }, []);

  // Obtener las compras desde la API
  const fetchCompras = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/compras");
      const data = await response.json();
      setCompras(data);
    } catch (error) {
      console.error("Error al obtener las compras:", error);
    }
  };

  // Crear una nueva compra
  const handleCreateCompra = async () => {
    if (!nuevaCompra.fecha_compra.trim() || nuevaCompra.proveedor_id <= 0)
      return;

    try {
      const response = await fetch("http://localhost:3000/api/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaCompra),
      });

      if (response.ok) {
        setNuevaCompra({
          proveedor_id: 0,
          fecha_compra: "",
          total_compra: 0,
        });
        fetchCompras(); // Actualiza la lista después de crear
      } else {
        console.error("Error al crear la compra");
      }
    } catch (error) {
      console.error("Error al crear la compra:", error);
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

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestión de Compras
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Formulario para agregar una compra */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">ID Proveedor</label>
              <input
                type="number"
                name="proveedor_id"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="ID del proveedor"
                value={nuevaCompra.proveedor_id}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Fecha Compra</label>
              <input
                type="date"
                name="fecha_compra"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={nuevaCompra.fecha_compra}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Total Compra</label>
              <input
                type="number"
                name="total_compra"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Total"
                step="0.01"
                value={nuevaCompra.total_compra}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 col-span-3"
              onClick={handleCreateCompra}
            >
              Registrar Compra
            </button>
          </div>

          {/* Lista de compras */}
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Proveedor ID</th>
                  <th className="py-2 px-4 border">Fecha</th>
                  <th className="py-2 px-4 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((compra) => (
                  <tr key={compra.compra_id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border text-center">
                      {compra.compra_id}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {compra.proveedor_id}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {new Date(compra.fecha_compra).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      ${compra.total_compra.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComprasPage;
