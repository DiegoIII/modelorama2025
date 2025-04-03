"use client";
import React, { useEffect, useState } from "react";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faSpinner,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faUser,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/proveedores");
      if (!res.ok) throw new Error("Error al cargar proveedores");
      setProveedores(await res.json());
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudieron cargar los proveedores");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (Object.values(proveedor).some((v) => !v.trim())) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = editId ? `/api/proveedores/${editId}` : "/api/proveedores";

      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proveedor),
      });

      if (!res.ok)
        throw new Error(editId ? "Error al actualizar" : "Error al crear");

      setProveedor({
        nombre_proveedor: "",
        contacto: "",
        telefono: "",
        email: "",
      });
      setEditId(null);
      fetchProveedores();
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este proveedor?")) return;

    try {
      const res = await fetch(`/api/proveedores/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      fetchProveedores();
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const fields = [
    {
      key: "nombre_proveedor",
      placeholder: "Nombre del proveedor",
      type: "text",
      icon: faTruck,
    },
    {
      key: "contacto",
      placeholder: "Persona de contacto",
      type: "text",
      icon: faUser,
    },
    {
      key: "telefono",
      placeholder: "Teléfono",
      type: "tel",
      icon: faPhone,
    },
    {
      key: "email",
      placeholder: "Correo electrónico",
      type: "email",
      icon: faEnvelope,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <FontAwesomeIcon
            icon={faTruck}
            className="text-3xl mr-3 text-[#F2B705]"
          />
          <h1 className="text-3xl font-bold text-[#031D40]">
            Gestión de Proveedores
          </h1>
        </div>

        {/* Formulario de proveedores */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#F2B705] mb-8">
          <h2 className="text-xl font-semibold text-[#032059] mb-4">
            {editId ? "Editar Proveedor" : "Agregar Nuevo Proveedor"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {fields.map(({ key, placeholder, type, icon }) => (
              <div key={key}>
                <label className="text-[#031D40] font-medium mb-2 flex items-center">
                  <FontAwesomeIcon icon={icon} className="mr-2" />
                  {placeholder}
                </label>
                <input
                  type={type}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                  placeholder={placeholder}
                  value={proveedor[key as keyof typeof proveedor]}
                  onChange={(e) =>
                    setProveedor({ ...proveedor, [key]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#032059] hover:bg-[#031D40] text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={editId ? faSave : faPlus}
                    className="mr-2"
                  />
                  {editId ? "Actualizar" : "Agregar"} Proveedor
                </>
              )}
            </button>

            {editId && (
              <button
                onClick={() => {
                  setEditId(null);
                  setProveedor({
                    nombre_proveedor: "",
                    contacto: "",
                    telefono: "",
                    email: "",
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancelar
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Listado de proveedores */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-[#031D40] text-white">
            <h2 className="text-xl font-semibold flex items-center">
              <FontAwesomeIcon icon={faTruck} className="mr-2" />
              Listado de Proveedores
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-4xl text-[#032059] mb-4"
              />
              <p className="text-lg text-[#031D40]">Cargando proveedores...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {proveedores.length > 0 ? (
                proveedores.map((p) => (
                  <li
                    key={p.proveedor_id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    {editId === p.proveedor_id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {fields.map(({ key, placeholder, type, icon }) => (
                            <div key={key}>
                              <label className="text-[#031D40] font-medium mb-2 flex items-center">
                                <FontAwesomeIcon icon={icon} className="mr-2" />
                                {placeholder}
                              </label>
                              <input
                                type={type}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent"
                                value={proveedor[key as keyof typeof proveedor]}
                                onChange={(e) =>
                                  setProveedor({
                                    ...proveedor,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faSave} className="mr-2" />
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-medium text-[#032059] flex items-center">
                            <FontAwesomeIcon
                              icon={faTruck}
                              className="mr-2 text-[#F2B705]"
                            />
                            {p.nombre_proveedor}
                          </div>
                          <div className="text-sm text-gray-600 mt-1 space-y-1">
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faUser}
                                className="mr-2 text-[#032059]"
                              />
                              {p.contacto}
                            </div>
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faPhone}
                                className="mr-2 text-[#032059]"
                              />
                              {p.telefono}
                            </div>
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faEnvelope}
                                className="mr-2 text-[#032059]"
                              />
                              {p.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                          <button
                            onClick={() => {
                              setProveedor(p);
                              setEditId(p.proveedor_id);
                            }}
                            className="bg-[#F2B705] hover:bg-[#e0a904] text-[#031D40] px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(p.proveedor_id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <li className="p-8 text-center text-gray-500">
                  No hay proveedores registrados
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProveedoresPage;
