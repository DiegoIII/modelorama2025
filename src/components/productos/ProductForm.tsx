"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Product {
  id?: string;
  nombre: string;
  descripcion: string;
  precio_compra: number | string;
  precio_venta: number | string;
  stock_minimo: number | string;
  stock_maximo: number | string;
  categoria: string;
  proveedor: string;
  imagenUrl: string;
}

interface ProductFormProps {
  onProductAdded: () => void;
  productToEdit?: Product;
}

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

const ProductForm = ({ onProductAdded, productToEdit }: ProductFormProps) => {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [proveedores, setProveedores] = useState<string[]>([]);

  useEffect(() => {
    if (productToEdit) {
      const { ...rest } = productToEdit;
      setFormData(
        Object.entries(rest).reduce(
          (acc, [key, val]) => ({
            ...acc,
            [key]: typeof val === "number" ? val.toString() : val || "",
          }),
          initialForm
        )
      );
    } else {
      setFormData(initialForm);
    }
  }, [productToEdit]);

  useEffect(() => {
    const fetchRelacionales = async () => {
      try {
        const [resCat, resProv] = await Promise.all([
          fetch("/api/categorias"),
          fetch("/api/proveedores"),
        ]);

        const [dataCat, dataProv] = await Promise.all([
          resCat.json(),
          resProv.json(),
        ]);

        setCategorias(
          dataCat.map((c: { nombre_categoria: string }) => c.nombre_categoria)
        );
        setProveedores(
          dataProv.map((p: { nombre_proveedor: string }) => p.nombre_proveedor)
        );
      } catch (err) {
        console.error("Error al obtener datos relacionales:", err);
      }
    };

    fetchRelacionales();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

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
          method: productToEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            ...numericFields,
            imagenUrl:
              formData.imagenUrl.trim() !== ""
                ? formData.imagenUrl
                : "/placeholder.png",
          }),
        }
      );

      if (!response.ok) throw new Error("Error al guardar el producto");
      onProductAdded();
      if (!productToEdit) setFormData(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg border border-[#031D40]/20"
    >
      <h2 className="text-2xl font-bold text-[#032059] mb-6 border-b pb-2 border-[#F2B705]/50">
        {productToEdit ? "Editar Producto" : "Agregar Nuevo Producto"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#031D40]">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Descripción */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#031D40]">
            Descripción
          </label>
          <input
            name="descripcion"
            type="text"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Precio compra */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#031D40]">
            Precio Compra <span className="text-red-500">*</span>
          </label>
          <input
            name="precio_compra"
            type="number"
            value={formData.precio_compra}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Precio venta */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#031D40]">
            Precio Venta <span className="text-red-500">*</span>
          </label>
          <input
            name="precio_venta"
            type="number"
            value={formData.precio_venta}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Stock mínimo */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#031D40]">
            Stock Mínimo <span className="text-red-500">*</span>
          </label>
          <input
            name="stock_minimo"
            type="number"
            value={formData.stock_minimo}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Stock máximo */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#031D40]">
            Stock Máximo <span className="text-red-500">*</span>
          </label>
          <input
            name="stock_maximo"
            type="number"
            value={formData.stock_maximo}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Categoría */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#031D40]">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Proveedor */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#031D40]">
            Proveedor <span className="text-red-500">*</span>
          </label>
          <select
            name="proveedor"
            value={formData.proveedor}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* Imagen URL + preview */}
        <div className="md:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-[#031D40]">
            Imagen URL
          </label>
          <input
            name="imagenUrl"
            type="text"
            value={formData.imagenUrl}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {formData.imagenUrl && (
            <div className="mt-2">
              <p className="text-xs text-[#031D40]/70 mb-1">Vista previa:</p>
              <div className="relative w-32 h-20 border rounded overflow-hidden">
                <Image
                  src={formData.imagenUrl}
                  alt="Vista previa"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.png";
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() =>
            productToEdit ? onProductAdded() : setFormData(initialForm)
          }
          className="px-4 py-2 border border-[#032059] text-[#032059] rounded-lg hover:bg-[#032059]/10 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg text-white font-medium ${
            productToEdit
              ? "bg-[#F2B705] hover:bg-[#F2B705]/90 text-[#032059]"
              : "bg-[#032059] hover:bg-[#031D40]"
          } ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          } transition-colors flex items-center justify-center min-w-[120px]`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {productToEdit ? "Actualizando..." : "Agregando..."}
            </>
          ) : productToEdit ? (
            "Actualizar Producto"
          ) : (
            "Agregar Producto"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
