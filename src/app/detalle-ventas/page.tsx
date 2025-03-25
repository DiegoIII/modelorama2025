"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";

interface DetalleVenta {
  detalle_venta_id: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface Producto {
  producto_id: number;
  nombre: string;
}

interface Venta {
  venta_id: number;
  fecha_venta: string;
}

const DetalleVentasPage: React.FC = () => {
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    venta_id: "",
    producto_id: "",
    cantidad: 1,
    precio_unitario: 0,
  });

  useEffect(() => {
    fetchDetalleVentas();
    fetchProductos();
    fetchVentas();
  }, []);

  // Obtener detalle_ventas
  const fetchDetalleVentas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/detalle-ventas");
      const data = await response.json();
      setDetalles(data);
    } catch (error) {
      console.error("Error al obtener detalle de ventas:", error);
    }
  };

  // Obtener productos
  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/productos");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // Obtener ventas
  const fetchVentas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/ventas");
      const data = await response.json();
      setVentas(data);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  // Crear nuevo detalle de venta
  const handleCreateDetalleVenta = async () => {
    const { venta_id, producto_id, cantidad, precio_unitario } = nuevoDetalle;

    if (!venta_id || !producto_id || cantidad <= 0 || precio_unitario <= 0)
      return;

    const subtotal = cantidad * precio_unitario;

    try {
      const response = await fetch("http://localhost:3000/api/detalle-ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venta_id: parseInt(venta_id),
          producto_id: parseInt(producto_id),
          cantidad,
          precio_unitario,
          subtotal,
        }),
      });

      if (response.ok) {
        setNuevoDetalle({
          venta_id: "",
          producto_id: "",
          cantidad: 1,
          precio_unitario: 0,
        });
        fetchDetalleVentas(); // Actualizar la lista
      } else {
        console.error("Error al crear detalle de venta");
      }
    } catch (error) {
      console.error("Error al crear detalle de venta:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestión de Detalles de Ventas
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Formulario para agregar detalle de venta */}
          <div className="mb-4 space-y-2">
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={nuevoDetalle.venta_id}
              onChange={(e) =>
                setNuevoDetalle({ ...nuevoDetalle, venta_id: e.target.value })
              }
            >
              <option value="">Selecciona una venta</option>
              {ventas.map((venta) => (
                <option key={venta.venta_id} value={venta.venta_id}>
                  Venta #{venta.venta_id} - {venta.fecha_venta}
                </option>
              ))}
            </select>

            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
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
                <option key={producto.producto_id} value={producto.producto_id}>
                  {producto.nombre}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Cantidad"
              value={nuevoDetalle.cantidad}
              onChange={(e) =>
                setNuevoDetalle({
                  ...nuevoDetalle,
                  cantidad: Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Precio unitario"
              value={nuevoDetalle.precio_unitario}
              onChange={(e) =>
                setNuevoDetalle({
                  ...nuevoDetalle,
                  precio_unitario: Number(e.target.value),
                })
              }
            />

            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleCreateDetalleVenta}
            >
              Agregar Detalle de Venta
            </button>
          </div>

          {/* Lista de detalles de venta */}
          <ul className="mt-4">
            {detalles.map((detalle) => (
              <li key={detalle.detalle_venta_id} className="p-2 border-b">
                Venta #{detalle.venta_id} - Producto #{detalle.producto_id} -
                Cantidad: {detalle.cantidad} - Precio: {detalle.precio_unitario}{" "}
                - Subtotal: {detalle.subtotal}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default DetalleVentasPage;
