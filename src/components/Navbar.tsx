"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faTags,
  faList,
  faShoppingCart,
  faReceipt,
  faMoneyBillWave,
  faCoins,
  faChartLine,
  faBoxes,
  faBoxOpen,
  faTruck,
  faBeer,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import useAuthStore from "../stores/useAuthStore";

interface NavLinkProps {
  href: string;
  icon: IconDefinition;
  text: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, text, onClick }) => {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center px-3 py-2 rounded-lg transition-colors
        text-white hover:bg-[#032059] hover:text-[#F2B705] group"
      >
        <FontAwesomeIcon
          icon={icon}
          className="mr-2 group-hover:scale-110 transition-transform"
        />
        <span className="hidden sm:inline">{text}</span>
      </Link>
    </li>
  );
};

const Navbar: React.FC = () => {
  const { token, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", icon: faHome, text: "Inicio" },
    { href: "/categoria-gastos", icon: faCoins, text: "Categoría Gastos" },
    { href: "/categorias", icon: faTags, text: "Categorías" },
    { href: "/compras", icon: faShoppingCart, text: "Compras" },
    { href: "/detalle-compras", icon: faReceipt, text: "Detalle Compras" },
    { href: "/detalle-ventas", icon: faChartLine, text: "Detalle Ventas" },
    { href: "/gastos", icon: faMoneyBillWave, text: "Gastos" },
    { href: "/inventario", icon: faBoxes, text: "Inventario" },
    { href: "/productos", icon: faBoxOpen, text: "Productos" },
    { href: "/proveedores", icon: faTruck, text: "Proveedores" },
    { href: "/ventas", icon: faList, text: "Ventas" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-[#031D40] p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo y botón móvil */}
        <div className="w-full md:w-auto flex justify-between items-center">
          <div className="text-[#F2B705] text-xl font-bold flex items-center">
            <FontAwesomeIcon icon={faBeer} className="mr-2 text-2xl" />
            <span className="text-2xl">Modelorama</span>
          </div>

          {/* Botón móvil */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>

        {/* Menú principal */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center w-full md:w-auto mt-4 md:mt-0`}
        >
          {/* Si hay token, mostrar los menús */}
          {token ? (
            <>
              <ul className="flex flex-col md:flex-row flex-wrap justify-center gap-2 md:gap-4 w-full md:w-auto">
                {navLinks.map((link) => (
                  <NavLink key={link.href} {...link} onClick={closeMenu} />
                ))}
              </ul>

              {/* Área de usuario */}
              <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0 md:ml-6 border-t md:border-t-0 border-[#032059] pt-4 md:pt-0 w-full md:w-auto">
                {user && (
                  <div className="flex items-center text-white">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors shadow-md"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </>
          ) : (
            // Si no hay token, mostrar el botón de inicio de sesión
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex items-center bg-[#F2B705] hover:bg-[#e0a904] text-[#031D40] font-semibold px-4 py-2 rounded-md transition-colors shadow-md w-full justify-center md:w-auto mt-4 md:mt-0"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              <span>Iniciar sesión</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
