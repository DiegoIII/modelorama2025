"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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

interface Producto {
  producto_id: number;
  nombre: string;
  precio_venta: number;
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
  const [productoId, setProductoId] = useState<string>("");
  const [cantidad, setCantidad] = useState<string>("");
  const [precio, setPrecio] = useState<string>("");
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("/api/productos");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setProductos(data.data);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const handleProductoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setProductoId(selectedId);

    const selectedProduct = productos.find(
      (p) => p.producto_id === Number(selectedId)
    );
    if (selectedProduct) {
      setPrecio(String(selectedProduct.precio_venta));
    }
  };

  const addDetalle = () => {
    if (!productoId || !cantidad || !precio) return;

    const selectedProduct = productos.find(
      (p) => p.producto_id === Number(productoId)
    );

    const newDetalle: DetalleVentaInput = {
      producto_id: Number(productoId),
      cantidad: Number(cantidad),
      precio: Number(precio),
      nombre_producto: selectedProduct?.nombre,
    };
    setDetalles([...detalles, newDetalle]);
    setTotalVenta(totalVenta + Number(cantidad) * Number(precio));
    setProductoId("");
    setCantidad("");
    setPrecio("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ total_venta: totalVenta, detalles });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#F5F7FA] p-4 rounded-lg">
        <label className="block text-[#031D40] font-medium mb-2">
          Total Venta
        </label>
        <input
          type="number"
          value={totalVenta}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent bg-white"
        />
      </div>

      <div className="bg-[#F5F7FA] p-4 rounded-lg">
        <h3 className="text-[#031D40] font-semibold mb-3">Agregar Productos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[#031D40] text-sm mb-1">
              Producto
            </label>
            <select
              value={productoId}
              onChange={handleProductoChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent bg-white"
              required
            >
              <option value="">Seleccione un producto</option>
              {productos.map((prod) => (
                <option key={prod.producto_id} value={prod.producto_id}>
                  {prod.nombre} -{" "}
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(prod.precio_venta)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#031D40] text-sm mb-1">
              Cantidad
            </label>
            <input
              type="number"
              placeholder="0"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-[#031D40] text-sm mb-1">
              Precio Unitario
            </label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032059] focus:border-transparent bg-white"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={addDetalle}
              className="bg-[#032059] hover:bg-[#031D40] text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors w-full"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors w-full sm:w-auto"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="bg-[#F2B705] hover:bg-[#e0a904] text-[#031D40] px-6 py-3 rounded-lg flex items-center justify-center transition-colors w-full sm:w-auto font-semibold"
        >
          {initialData ? "Actualizar Venta" : "Registrar Venta"}
        </button>
      </div>
    </form>
  );
};

export default VentaForm;
