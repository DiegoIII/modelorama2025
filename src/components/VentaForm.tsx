"use client";

import React, { useState } from "react";

export interface DetalleVentaInput {
  producto_id: number;
  cantidad: number;
  precio: number;
  nombre_producto?: string;
}

export interface VentaFormData {
  total_venta: number;
  detalles: DetalleVentaInput[];
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
  const [totalVenta, setTotalVenta] = useState<number>(
    initialData ? initialData.total_venta : 0
  );
  const [detalles, setDetalles] = useState<DetalleVentaInput[]>(
    initialData ? initialData.detalles : []
  );

  // Campos temporales para agregar un detalle
  const [productoId, setProductoId] = useState<string>("");
  const [cantidad, setCantidad] = useState<string>("");
  const [precio, setPrecio] = useState<string>("");

  const addDetalle = () => {
    if (!productoId || !cantidad || !precio) return;
    const newDetalle: DetalleVentaInput = {
      producto_id: Number(productoId),
      cantidad: Number(cantidad),
      precio: Number(precio),
    };
    setDetalles([...detalles, newDetalle]);
    setProductoId("");
    setCantidad("");
    setPrecio("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ total_venta: totalVenta, detalles });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Total Venta:</label>
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
          <input
            type="number"
            placeholder="Producto ID"
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            className="border rounded px-2 py-1"
          />
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
        <h4 className="font-semibold">Detalles:</h4>
        <ul className="list-disc ml-5">
          {detalles.map((d, i) => (
            <li key={i}>
              Producto {d.producto_id} - Cantidad: {d.cantidad} - Precio:{" "}
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
