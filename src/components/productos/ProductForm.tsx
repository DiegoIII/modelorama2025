import { createProduct } from "app/app/api/products.api";
import { useState } from "react";

interface ProductFormProps {
  onProductAdded: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio_compra: "",
    precio_venta: "",
    stock_minimo: "",
    stock_maximo: "",
    categoria: "",
    proveedor: "",
    imagenUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProduct(formData);
    onProductAdded();
    setFormData({
      nombre: "",
      descripcion: "",
      precio_compra: "",
      precio_venta: "",
      stock_minimo: "",
      stock_maximo: "",
      categoria: "",
      proveedor: "",
      imagenUrl: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6"
    >
      <h2 className="text-lg font-bold mb-4">Agregar Producto</h2>

      <label className="block mb-2">Nombre</label>
      <input
        name="nombre"
        placeholder="Nombre"
        onChange={handleChange}
        value={formData.nombre}
        required
        className="w-full mb-2 p-2 border rounded"
      />

      <label className="block mb-2">Descripción</label>
      <textarea
        name="descripcion"
        placeholder="Descripción"
        onChange={handleChange}
        value={formData.descripcion}
        className="w-full mb-2 p-2 border rounded"
      />

      <label className="block mb-2">Precio Compra</label>
      <input
        name="precio_compra"
        type="number"
        placeholder="Precio de compra"
        onChange={handleChange}
        value={formData.precio_compra}
        required
        className="w-full mb-2 p-2 border rounded"
      />

      <label className="block mb-2">Precio Venta</label>
      <input
        name="precio_venta"
        type="number"
        placeholder="Precio de venta"
        onChange={handleChange}
        value={formData.precio_venta}
        required
        className="w-full mb-2 p-2 border rounded"
      />

      <label className="block mb-2">Stock Mínimo</label>
      <input
        name="stock_minimo"
        type="number"
        placeholder="Stock mínimo"
        onChange={handleChange}
        value={formData.stock_minimo}
        required
        className="w-full mb-2 p-2 border rounded"
      />

      <label className="block mb-2">Stock Máximo</label>
      <input
        name="stock_maximo"
        type="number"
        placeholder="Stock máximo"
        onChange={handleChange}
        value={formData.stock_maximo}
        required
        className="w-full mb-2 p-2 border rounded"
      />

      <label className="block mb-2">Categoría</label>
      <input
        name="categoria"
        placeholder="Categoría"
        onChange={handleChange}
        value={formData.categoria}
        required
        className="w-full mb-2 p-2 border rounded"
      />

      <label className="block mb-2">Proveedor</label>
      <input
        name="proveedor"
        placeholder="Proveedor"
        onChange={handleChange}
        value={formData.proveedor}
        required
        className="w-full mb-2 p-2 border rounded"
      />

      <label className="block mb-2">URL de Imagen</label>
      <input
        name="imagenUrl"
        placeholder="URL Imagen"
        onChange={handleChange}
        value={formData.imagenUrl}
        className="w-full mb-2 p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Agregar Producto
      </button>
    </form>
  );
};

export default ProductForm;
