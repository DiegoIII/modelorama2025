import Navbar from "app/components/Navbar";
import React from "react";
import Layout from "app/layout/Layout";

const PageLayout = () => {
  return (
    <>
      <Layout>
        <section className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">
            Bienvenido al Sistema de Gestión Comercial
          </h1>
          <p className="mb-8 text-lg">
            Esta aplicación le permite gestionar productos, inventario, ventas,
            compras y gastos de su negocio de manera eficiente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Módulo de Productos */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">
                📦 Gestión de Productos
              </h2>
              <p className="mb-2">En este módulo podrá:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Registrar nuevos productos con sus precios de compra y venta
                </li>
                <li>Organizar productos por categorías</li>
                <li>Asociar productos a proveedores</li>
                <li>Definir niveles mínimos y máximos de stock</li>
                <li>Consultar y editar información de productos</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                <strong>Datos clave:</strong> nombre, descripción, precios,
                categoría, proveedor.
              </p>
            </div>

            {/* Módulo de Inventario */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">
                📊 Control de Inventario
              </h2>
              <p className="mb-2">Este módulo le permite:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Consultar el stock actual de todos los productos</li>
                <li>Verificar productos con stock bajo (alerta)</li>
                <li>Actualizar cantidades disponibles</li>
                <li>Monitorear el historial de movimientos</li>
                <li>Generar reportes de inventario</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                <strong>Datos clave:</strong> producto, cantidad disponible,
                fecha de actualización.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Módulo de Ventas */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">
                💰 Gestión de Ventas
              </h2>
              <p className="mb-2">Funcionalidades principales:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Registrar nuevas ventas con múltiples productos</li>
                <li>Consultar historial de ventas por fechas</li>
                <li>Ver detalles de cada venta (productos, cantidades)</li>
                <li>Calcular totales y subtotales automáticamente</li>
                <li>Generar facturas o tickets de venta</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                <strong>Datos clave:</strong> fecha, productos vendidos,
                cantidades, precios, total.
              </p>
            </div>

            {/* Módulo de Compras */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">
                🛒 Gestión de Compras
              </h2>
              <p className="mb-2">En este módulo podrá:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Registrar compras a proveedores</li>
                <li>Asociar múltiples productos a cada compra</li>
                <li>Actualizar automáticamente el inventario</li>
                <li>Consultar historial de compras</li>
                <li>Monitorear gastos por proveedor</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                <strong>Datos clave:</strong> proveedor, fecha, productos
                comprados, cantidades, precios, total.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Módulo de Proveedores */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">
                🏢 Gestión de Proveedores
              </h2>
              <p className="mb-2">Funcionalidades disponibles:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Registrar información de proveedores</li>
                <li>Consultar productos asociados a cada proveedor</li>
                <li>Ver historial de compras por proveedor</li>
                <li>Mantener datos de contacto actualizados</li>
                <li>Clasificar proveedores por categorías</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                <strong>Datos clave:</strong> nombre, contacto, teléfono, email.
              </p>
            </div>

            {/* Módulo de Gastos */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">
                💸 Control de Gastos
              </h2>
              <p className="mb-2">Este módulo le permite:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Registrar gastos operativos (alquiler, servicios, etc.)</li>
                <li>Clasificar gastos por categorías</li>
                <li>Consultar gastos por períodos</li>
                <li>Generar reportes de gastos</li>
                <li>Monitorear el flujo de caja</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                <strong>Datos clave:</strong> descripción, monto, fecha,
                categoría.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold mb-3 text-blue-800">
              💡 Consejos para un uso efectivo
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-blue-700">
              <li>
                Mantenga actualizados los niveles de stock mínimo/máximo para
                recibir alertas oportunas
              </li>
              <li>
                Revise regularmente los reportes de ventas para identificar
                productos más vendidos
              </li>
              <li>
                Actualice los precios de compra y venta según cambios en el
                mercado
              </li>
              <li>
                Clasifique correctamente los productos y gastos para generar
                reportes más útiles
              </li>
              <li>
                Verifique el inventario antes de registrar ventas para evitar
                inconsistencias
              </li>
            </ul>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default PageLayout;
