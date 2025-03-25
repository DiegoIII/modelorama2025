"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";

interface DetalleCompra {
  detalle_compra_id: number;
  compra_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

const DetalleComprasPage: React.FC = () => {
  const [detalles, setDetalles] = useState<DetalleCompra[]>([]);
  const [nuevoDetalle, setNuevoDetalle] = useState<
    Omit<DetalleCompra, "detalle_compra_id" | "subtotal">
  >({
    compra_id: 0,
    producto_id: 0,
    cantidad: 0,
    precio_unitario: 0,
  });

  useEffect(() => {
    fetchDetalles();
  }, []);

  // Obtener los detalles desde la API
  const fetchDetalles = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/detallecompras");
      const data = await response.json();
      setDetalles(data);
    } catch (error) {
      console.error("Error al obtener los detalles de compra:", error);
    }
  };

  // Crear un nuevo detalle
  const handleCreateDetalle = async () => {
    if (
      nuevoDetalle.compra_id <= 0 ||
      nuevoDetalle.producto_id <= 0 ||
      nuevoDetalle.cantidad <= 0
    )
      return;

    try {
      const response = await fetch("http://localhost:3000/api/detallecompras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...nuevoDetalle,
          subtotal: nuevoDetalle.cantidad * nuevoDetalle.precio_unitario,
        }),
      });

      if (response.ok) {
        setNuevoDetalle({
          compra_id: 0,
          producto_id: 0,
          cantidad: 0,
          precio_unitario: 0,
        });
        fetchDetalles(); // Actualiza la lista después de crear
      } else {
        console.error("Error al crear el detalle de compra");
      }
    } catch (error) {
      console.error("Error al crear el detalle de compra:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoDetalle((prev) => ({
      ...prev,
      [name]:
        name === "compra_id" ||
        name === "producto_id" ||
        name === "cantidad" ||
        name === "precio_unitario"
          ? Number(value)
          : value,
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestión de Detalles de Compra
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Formulario para agregar un detalle */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">ID Compra</label>
              <input
                type="number"
                name="compra_id"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="ID de la compra"
                value={nuevoDetalle.compra_id}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">ID Producto</label>
              <input
                type="number"
                name="producto_id"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="ID del producto"
                value={nuevoDetalle.producto_id}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Cantidad"
                min="1"
                value={nuevoDetalle.cantidad}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">
                Precio Unitario
              </label>
              <input
                type="number"
                name="precio_unitario"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Precio unitario"
                step="0.01"
                min="0"
                value={nuevoDetalle.precio_unitario}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 col-span-4"
              onClick={handleCreateDetalle}
            >
              Agregar Detalle
            </button>
          </div>

          {/* Lista de detalles */}
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">ID Detalle</th>
                  <th className="py-2 px-4 border">ID Compra</th>
                  <th className="py-2 px-4 border">ID Producto</th>
                  <th className="py-2 px-4 border">Cantidad</th>
                  <th className="py-2 px-4 border">Precio Unitario</th>
                  <th className="py-2 px-4 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle) => (
                  <tr
                    key={detalle.detalle_compra_id}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-2 px-4 border text-center">
                      {detalle.detalle_compra_id}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {detalle.compra_id}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {detalle.producto_id}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {detalle.cantidad}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      ${detalle.precio_unitario.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      ${detalle.subtotal.toFixed(2)}
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

export default DetalleComprasPage;
