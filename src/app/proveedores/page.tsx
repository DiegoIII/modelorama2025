"use client";

import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";

interface Proveedor {
  proveedor_id: number;
  nombre_proveedor: string;
  contacto: string;
  telefono: string;
  email: string;
}

const ProveedoresPage: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre_proveedor: "",
    contacto: "",
    telefono: "",
    email: "",
  });

  useEffect(() => {
    fetchProveedores();
  }, []);

  // Obtener los proveedores desde la API
  const fetchProveedores = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/proveedores");
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }
  };

  // Crear un nuevo proveedor
  const handleCreateProveedor = async () => {
    const { nombre_proveedor, contacto, telefono, email } = nuevoProveedor;

    if (
      !nombre_proveedor.trim() ||
      !contacto.trim() ||
      !telefono.trim() ||
      !email.trim()
    )
      return;

    try {
      const response = await fetch("http://localhost:3000/api/proveedores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoProveedor),
      });

      if (response.ok) {
        setNuevoProveedor({
          nombre_proveedor: "",
          contacto: "",
          telefono: "",
          email: "",
        });
        fetchProveedores(); // Actualiza la lista después de crear
      } else {
        console.error("Error al crear el proveedor");
      }
    } catch (error) {
      console.error("Error al crear el proveedor:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestión de Proveedores
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Formulario para agregar un proveedor */}
          <div className="mb-4 space-y-2">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Nombre del proveedor"
              value={nuevoProveedor.nombre_proveedor}
              onChange={(e) =>
                setNuevoProveedor({
                  ...nuevoProveedor,
                  nombre_proveedor: e.target.value,
                })
              }
            />
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Persona de contacto"
              value={nuevoProveedor.contacto}
              onChange={(e) =>
                setNuevoProveedor({
                  ...nuevoProveedor,
                  contacto: e.target.value,
                })
              }
            />
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Teléfono"
              value={nuevoProveedor.telefono}
              onChange={(e) =>
                setNuevoProveedor({
                  ...nuevoProveedor,
                  telefono: e.target.value,
                })
              }
            />
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Correo electrónico"
              value={nuevoProveedor.email}
              onChange={(e) =>
                setNuevoProveedor({ ...nuevoProveedor, email: e.target.value })
              }
            />
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleCreateProveedor}
            >
              Agregar Proveedor
            </button>
          </div>

          {/* Lista de proveedores */}
          <ul className="mt-4">
            {proveedores.map((proveedor) => (
              <li key={proveedor.proveedor_id} className="p-2 border-b">
                <strong>{proveedor.nombre_proveedor}</strong> -{" "}
                {proveedor.contacto} - {proveedor.telefono} - {proveedor.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ProveedoresPage;
