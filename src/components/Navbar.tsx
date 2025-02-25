import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">MiLogo</div>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="text-white hover:text-gray-200">
              Inicio
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-200">
              Acerca de
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-200">
              Servicios
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-200">
              Contacto
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
