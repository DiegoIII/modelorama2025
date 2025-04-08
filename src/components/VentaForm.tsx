"use client";

import React, { useState, useEffect } from "react";

// Representa cada detalle individual que se agregará a la venta
export interface DetalleVentaInput {
  producto_id: number;
  cantidad: number;
  precio: number; // 'precio' se usará como 'precio_unitario' en el backend
  nombre_producto?: string;
}

// Representa la estructura final que el formulario envía al onSubmit
export interface VentaFormData {
  total_venta: number;
  detalles: DetalleVentaInput[];
}

interface Producto {
  producto_id: number;
  nombre: string;
  precio_venta: number;
  // Puedes incluir más campos según tu schema
}

export interface VentaFormProps {
  onSubmit: (venta: VentaFormData) => Promise<void> | void;
  initialData?: VentaFormData;
  onCancel?: () => void;
}

const VentaForm: React.FC<VentaFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  // Campos para la venta
  const [totalVenta, setTotalVenta] = useState<number>(
    initialData ? initialData.total_venta : 0
  );
  const [detalles, setDetalles] = useState<DetalleVentaInput[]>(
    initialData ? initialData.detalles : []
  );

  // Estados temporales para agregar un nuevo detalle
  const [productoId, setProductoId] = useState<string>("");
  const [cantidad, setCantidad] = useState<string>("");
  const [precio, setPrecio] = useState<string>("");

  // Lista de productos para el <select>
  const [productos, setProductos] = useState<Producto[]>([]);

  // Cargar los productos desde el endpoint /api/productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("/api/productos");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Cada item en data.data debería contener { producto_id, nombre, precio_venta, ... }
          setProductos(data.data);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Manejo de la selección del producto
  const handleProductoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setProductoId(selectedId);

    // Opcional: prellenar el precio unitario con precio_venta del producto seleccionado
    const selectedProduct = productos.find(
      (p) => p.producto_id === Number(selectedId)
    );
    if (selectedProduct) {
      setPrecio(String(selectedProduct.precio_venta));
    }
  };

  // Agregar un nuevo detalle a la lista
  const addDetalle = () => {
    // Validar
    if (!productoId || !cantidad || !precio) return;

    const newDetalle: DetalleVentaInput = {
      producto_id: Number(productoId),
      cantidad: Number(cantidad),
      precio: Number(precio),
    };
    setDetalles([...detalles, newDetalle]);

    // Limpiamos los campos temporales
    setProductoId("");
    setCantidad("");
    setPrecio("");
  };

  // Enviar el formulario completo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ total_venta: totalVenta, detalles });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Total Venta</label>
        <input
          type="number"
          value={totalVenta}
          onChange={(e) => setTotalVenta(Number(e.target.value))}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <h3 className="font-semibold">Agregar Detalle</h3>
        <div className="flex space-x-2">
          {/* SELECT para elegir el producto */}
          <select
            value={productoId}
            onChange={handleProductoChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Seleccione un producto</option>
            {productos.map((prod) => (
              <option key={prod.producto_id} value={prod.producto_id}>
                {prod.nombre} - ${prod.precio_venta}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button
            type="button"
            onClick={addDetalle}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Agregar
          </button>
        </div>
      </div>

      <div>
        <h4 className="font-semibold">Detalles agregados:</h4>
        <ul className="list-disc ml-5">
          {detalles.map((d, i) => (
            <li key={i}>
              Producto #{d.producto_id} - Cantidad: {d.cantidad} - Precio:{" "}
              {d.precio}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {initialData ? "Actualizar Venta" : "Registrar Venta"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default VentaForm;
