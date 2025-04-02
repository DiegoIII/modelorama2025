"use client";
import { useState, useEffect } from "react";

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
    // Si se está editando un producto, carga sus datos
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
    // Obtener categorías y proveedores desde la BD
    const fetchRelacionales = async () => {
      try {
        const resCat = await fetch("/api/categorias");
        const dataCat = await resCat.json();
        // Se espera que dataCat sea un arreglo de objetos con { nombre_categoria }
        setCategorias(
          dataCat.map((c: { nombre_categoria: string }) => c.nombre_categoria)
        );

        const resProv = await fetch("/api/proveedores");
        const dataProv = await resProv.json();
        // Se espera que dataProv sea un arreglo de objetos con { nombre_proveedor }
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
          method: productToEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            ...numericFields,
            imagenUrl: formData.imagenUrl || "/placeholder.png",
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
      className="bg-white p-6 rounded-lg shadow-md mb-6"
    >
      <h2 className="text-xl font-semibold mb-6">
        {productToEdit ? "Editar Producto" : "Agregar Producto"}
      </h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo: Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Campo: Descripción */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <input
            name="descripcion"
            type="text"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Campo: Precio Compra */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Precio Compra <span className="text-red-500">*</span>
          </label>
          <input
            name="precio_compra"
            type="number"
            value={formData.precio_compra}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
            step="0.01"
          />
        </div>

        {/* Campo: Precio Venta */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Precio Venta <span className="text-red-500">*</span>
          </label>
          <input
            name="precio_venta"
            type="number"
            value={formData.precio_venta}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
            step="0.01"
          />
        </div>

        {/* Campo: Stock Mínimo */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Stock Mínimo <span className="text-red-500">*</span>
          </label>
          <input
            name="stock_minimo"
            type="number"
            value={formData.stock_minimo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Campo: Stock Máximo */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Stock Máximo <span className="text-red-500">*</span>
          </label>
          <input
            name="stock_maximo"
            type="number"
            value={formData.stock_maximo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Campo: Categoría (select relacional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Campo: Proveedor (select relacional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Proveedor <span className="text-red-500">*</span>
          </label>
          <select
            name="proveedor"
            value={formData.proveedor}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* Campo: Imagen URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Imagen URL</label>
          <input
            name="imagenUrl"
            type="text"
            value={formData.imagenUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
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
