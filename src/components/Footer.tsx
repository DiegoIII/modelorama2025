import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-bold">MiProyecto</h3>
            <p className="text-sm">
              © {new Date().getFullYear()} Todos los derechos reservados.
            </p>
          </div>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition duration-300"
            >
              Inicio
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition duration-300"
            >
              Acerca de
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition duration-300"
            >
              Servicios
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition duration-300"
            >
              Contacto
            </a>
          </div>
        </div>
        <div className="text-center mt-6 border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400">
            Desarrollado con ❤️ por{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              MiEquipo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
