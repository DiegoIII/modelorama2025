"use client";
import { useState, useEffect } from "react";

interface Product {
  id?: string;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  stock_minimo: number;
  stock_maximo: number;
  categoria: string;
  proveedor: string;
  imagenUrl: string;
}

interface ProductFormProps {
  onProductAdded: () => void;
  productToEdit?: Product;
}

const ProductForm = ({ onProductAdded, productToEdit }: ProductFormProps) => {
  const initialForm = {
    nombre: "",
    descripcion: "",
    precio_compra: "",
    precio_venta: "",
    stock_minimo: "",
    stock_maximo: "",
    categoria: "",
    proveedor: "",
    imagenUrl: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proveedores, setProveedores] = useState<string[]>([]);

  useEffect(() => {
    if (productToEdit) {
      const { id, ...rest } = productToEdit;
      setFormData(
        Object.entries(rest).reduce(
          (acc, [key, val]) => ({
            ...acc,
            [key]: typeof val === "number" ? val.toString() : val || "",
          }),
          initialForm
        )
      );
    }
  }, [productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const numericFields = {
        precio_compra: parseFloat(formData.precio_compra),
        precio_venta: parseFloat(formData.precio_venta),
        stock_minimo: parseInt(formData.stock_minimo),
        stock_maximo: parseInt(formData.stock_maximo),
      };

      const response = await fetch(
        productToEdit ? `/api/productos/${productToEdit.id}` : "/api/productos",
        {
          method: productToEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            ...numericFields,
            imagenUrl: formData.imagenUrl || "/placeholder.png",
          }),
        }
      );

      if (!response.ok) throw new Error("Error al guardar");
      onProductAdded();
      if (!productToEdit) setFormData(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">
        {productToEdit ? "Editar Producto" : "Agregar Producto"}
      </h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {key.replace("_", " ")}
              {key !== "descripcion" && key !== "imagenUrl" && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              name={key}
              type={
                key.includes("precio") || key.includes("stock")
                  ? "number"
                  : "text"
              }
              value={value}
              onChange={handleChange}
              required={key !== "descripcion" && key !== "imagenUrl"}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md text-white ${
          productToEdit ? "bg-yellow-600" : "bg-blue-600"
        } ${isSubmitting ? "opacity-50" : ""}`}
      >
        {isSubmitting
          ? "Procesando..."
          : productToEdit
          ? "Actualizar"
          : "Agregar"}
      </button>
    </form>
  );
};

export default ProductForm;
