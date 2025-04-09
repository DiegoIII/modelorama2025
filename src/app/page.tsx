"use client";

import Navbar from "app/components/Navbar";
import React, { useState, useEffect } from "react";
import Layout from "app/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faBoxes,
  faList,
  faShoppingCart,
  faTruck,
  faCoins,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

const PageLayout = () => {
  // Lista de posibles consejos
  const consejos = [
    "Actualice stock mínimo/máximo para evitar faltantes",
    "Revise reportes de ventas semanalmente para identificar tendencias",
    "Mantenga precios actualizados según costos y competencia",
    "Realice inventarios físicos periódicos para verificar exactitud",
    "Capacite a su equipo en el uso del sistema para mayor eficiencia",
    "Establezca metas de ventas y monitoree su progreso",
    "Analice los productos más y menos vendidos para optimizar inventario",
    "Negocie mejores condiciones con proveedores frecuentes",
    "Categorice sus gastos para un mejor control financiero",
    "Utilice promociones para mover productos de lenta rotación",
    "Mantenga actualizada la información de sus clientes",
    "Revise regularmente los vencimientos de productos perecederos",
    "Establezca un sistema de recompensas para empleados destacados",
    "Automatice procesos repetitivos para ahorrar tiempo",
    "Realice copias de seguridad de su información regularmente",
  ];

  // Estado para almacenar los consejos seleccionados
  const [consejosMostrados, setConsejosMostrados] = useState<string[]>([]);

  // Función para seleccionar consejos aleatorios
  const seleccionarConsejosAleatorios = () => {
    // Mezclar el array de consejos
    const consejosMezclados = [...consejos].sort(() => 0.5 - Math.random());
    // Seleccionar los primeros 3
    setConsejosMostrados(consejosMezclados.slice(0, 3));
  };

  // Ejecutar al montar el componente
  useEffect(() => {
    seleccionarConsejosAleatorios();
  }, []);

  return (
    <Layout>
      <section className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-[#031D40]">
          Bienvenido al Sistema de Gestión
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Productos */}
          <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#F2B705]">
            <div className="flex items-center mb-3">
              <FontAwesomeIcon
                icon={faBoxOpen}
                className="text-2xl mr-3 text-[#032059]"
              />
              <h2 className="text-xl font-semibold">Productos</h2>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Registrar productos</li>
              <li>• Definir precios</li>
              <li>• Organizar por categorías</li>
            </ul>
          </div>

          {/* Inventario */}
          <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#F2B705]">
            <div className="flex items-center mb-3">
              <FontAwesomeIcon
                icon={faBoxes}
                className="text-2xl mr-3 text-[#032059]"
              />
              <h2 className="text-xl font-semibold">Inventario</h2>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Control de stock</li>
              <li>• Alertas de bajo inventario</li>
              <li>• Historial de movimientos</li>
            </ul>
          </div>

          {/* Ventas */}
          <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#F2B705]">
            <div className="flex items-center mb-3">
              <FontAwesomeIcon
                icon={faList}
                className="text-2xl mr-3 text-[#032059]"
              />
              <h2 className="text-xl font-semibold">Ventas</h2>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Registrar ventas</li>
              <li>• Generar facturas</li>
              <li>• Historial por fechas</li>
            </ul>
          </div>

          {/* Compras */}
          <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#F2B705]">
            <div className="flex items-center mb-3">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-2xl mr-3 text-[#032059]"
              />
              <h2 className="text-xl font-semibold">Compras</h2>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Registrar compras</li>
              <li>• Actualizar inventario</li>
              <li>• Historial por proveedor</li>
            </ul>
          </div>

          {/* Proveedores */}
          <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#F2B705]">
            <div className="flex items-center mb-3">
              <FontAwesomeIcon
                icon={faTruck}
                className="text-2xl mr-3 text-[#032059]"
              />
              <h2 className="text-xl font-semibold">Proveedores</h2>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Gestionar proveedores</li>
              <li>• Contactos y productos</li>
              <li>• Historial de compras</li>
            </ul>
          </div>

          {/* Gastos */}
          <div className="bg-white p-5 rounded-lg shadow-md border-t-4 border-[#F2B705]">
            <div className="flex items-center mb-3">
              <FontAwesomeIcon
                icon={faCoins}
                className="text-2xl mr-3 text-[#032059]"
              />
              <h2 className="text-xl font-semibold">Gastos</h2>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Registrar gastos</li>
              <li>• Clasificar por categoría</li>
              <li>• Reportes mensuales</li>
            </ul>
          </div>
        </div>

        {/* Consejos */}
        <div className="mt-8 bg-[#F0F7FF] p-5 rounded-lg">
          <div className="flex items-center mb-3">
            <FontAwesomeIcon
              icon={faLightbulb}
              className="text-2xl mr-3 text-[#F2B705]"
            />
            <h2 className="text-xl font-semibold text-[#032059]">Consejos</h2>
          </div>
          <ul className="space-y-2 text-[#031D40]">
            {consejosMostrados.map((consejo, index) => (
              <li key={index}>• {consejo}</li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default PageLayout;
