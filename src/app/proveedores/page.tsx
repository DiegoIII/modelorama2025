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
  const [proveedor, setProveedor] = useState<
    Omit<Proveedor, "proveedor_id"> | Proveedor
  >({
    nombre_proveedor: "",
    contacto: "",
    telefono: "",
    email: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/proveedores");
      setProveedores(await res.json());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async () => {
    if (Object.values(proveedor).some((v) => !v.trim())) return;

    try {
      const url = editId
        ? `http://localhost:3000/api/proveedores/${editId}`
        : "http://localhost:3000/api/proveedores";

      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proveedor),
      });

      if (res.ok) {
        setProveedor({
          nombre_proveedor: "",
          contacto: "",
          telefono: "",
          email: "",
        });
        setEditId(null);
        fetchProveedores();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/proveedores/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchProveedores();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fields = [
    {
      key: "nombre_proveedor",
      placeholder: "Nombre del proveedor",
      type: "text",
    },
    { key: "contacto", placeholder: "Persona de contacto", type: "text" },
    { key: "telefono", placeholder: "Teléfono", type: "text" },
    { key: "email", placeholder: "Correo electrónico", type: "email" },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Gestión de Proveedores
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="mb-4 space-y-2">
            {fields.map(({ key, placeholder, type }) => (
              <input
                key={key}
                type={type}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder={placeholder}
                value={proveedor[key as keyof typeof proveedor]}
                onChange={(e) =>
                  setProveedor({ ...proveedor, [key]: e.target.value })
                }
              />
            ))}
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleSubmit}
            >
              {editId ? "Actualizar" : "Agregar"} Proveedor
            </button>
          </div>

          <ul className="mt-4">
            {proveedores.map((p) => (
              <li
                key={p.proveedor_id}
                className="p-4 border-b flex justify-between items-center"
              >
                {editId === p.proveedor_id ? (
                  <>
                    <div className="flex-grow space-y-2">
                      {fields.map(({ key, placeholder, type }) => (
                        <input
                          key={key}
                          type={type}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={proveedor[key as keyof typeof proveedor]}
                          onChange={(e) =>
                            setProveedor({
                              ...proveedor,
                              [key]: e.target.value,
                            })
                          }
                        />
                      ))}
                      <div className="flex space-x-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                          onClick={handleSubmit}
                        >
                          Guardar
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                          onClick={() => setEditId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>{p.nombre_proveedor}</strong> - {p.contacto} -{" "}
                      {p.telefono} - {p.email}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                        onClick={() => {
                          setProveedor(p);
                          setEditId(p.proveedor_id);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        onClick={() => handleDelete(p.proveedor_id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ProveedoresPage;
