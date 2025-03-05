interface DeleteDetalleVentaModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteDetalleVentaModal: React.FC<DeleteDetalleVentaModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center min-h-screen transition-opacity"
      onClick={onCancel}
      aria-hidden="true"
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ¿Seguro que quieres eliminar este registro de detalle de venta?
        </h3>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDetalleVentaModal;
