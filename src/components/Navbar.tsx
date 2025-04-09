"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
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
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useAuthStore } from "app/stores/useAuthStore";

interface NavLinkProps {
  href: string;
  icon: IconDefinition;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  isDropdown?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon,
  text,
  onClick,
  disabled,
  isDropdown = false,
  isOpen = false,
  onToggle,
}) => {
  if (disabled) {
    return (
      <li className="opacity-50 cursor-not-allowed">
        <div className="flex items-center px-3 py-2 rounded-lg text-white">
          <FontAwesomeIcon icon={icon} className="mr-2" />
          <span className="hidden sm:inline">{text}</span>
          {isDropdown && (
            <FontAwesomeIcon
              icon={isOpen ? faChevronUp : faChevronDown}
              className="ml-2 text-xs"
            />
          )}
        </div>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        onClick={isDropdown ? onToggle : onClick}
        className={`flex items-center px-3 py-2 rounded-lg transition-colors
        text-white hover:bg-[#032059] hover:text-[#F2B705] group ${
          isDropdown ? "justify-between" : ""
        }`}
      >
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={icon}
            className="mr-2 group-hover:scale-110 transition-transform"
          />
          <span className="hidden sm:inline">{text}</span>
        </div>
        {isDropdown && (
          <FontAwesomeIcon
            icon={isOpen ? faChevronUp : faChevronDown}
            className="ml-2 text-xs transition-transform"
          />
        )}
      </Link>
    </li>
  );
};

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, initialize } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    initialize();
  }, [initialize]);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const mainLinks = [
    { href: "/", icon: faHome, text: "Inicio", alwaysAvailable: true },
  ];

  const managementLinks = [
    { href: "/productos", icon: faBoxOpen, text: "Productos" },
    { href: "/inventario", icon: faBoxes, text: "Inventario" },
    { href: "/proveedores", icon: faTruck, text: "Proveedores" },
  ];

  const transactionLinks = [
    { href: "/ventas", icon: faList, text: "Ventas" },
    { href: "/compras", icon: faShoppingCart, text: "Compras" },
  ];

  const financialLinks = [
    { href: "/gastos", icon: faMoneyBillWave, text: "Gastos" },
    { href: "/categoria-gastos", icon: faCoins, text: "Categoría Gastos" },
    { href: "/detalle-ventas", icon: faChartLine, text: "Detalle Ventas" },
    { href: "/detalle-compras", icon: faReceipt, text: "Detalle Compras" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!isMounted) {
    return (
      <nav className="bg-[#031D40] p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-[#F2B705] text-xl font-bold flex items-center">
            <FontAwesomeIcon icon={faBeer} className="mr-2 text-2xl" />
            <span className="text-2xl">Modelorama</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#031D40] p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo y botón móvil */}
        <div className="w-full md:w-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-[#F2B705] text-xl font-bold flex items-center hover:text-[#F2B705]/90"
          >
            <FontAwesomeIcon icon={faBeer} className="mr-2 text-2xl" />
            <span className="text-2xl">Modelorama</span>
          </Link>

          {/* Botón móvil */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-[#032059]"
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
          <ul className="flex flex-col md:flex-row flex-wrap justify-center gap-1 md:gap-2 w-full md:w-auto">
            {mainLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                text={link.text}
                onClick={closeMenu}
                disabled={!link.alwaysAvailable && !isAuthenticated}
              />
            ))}

            {/* Menú desplegable para Gestión */}
            <li className="relative group">
              <div
                className="flex items-center px-3 py-2 rounded-lg transition-colors text-white hover:bg-[#032059] hover:text-[#F2B705] cursor-pointer"
                onClick={() => toggleDropdown("management")}
              >
                <FontAwesomeIcon icon={faBoxes} className="mr-2" />
                <span className="hidden sm:inline">Gestión</span>
                <FontAwesomeIcon
                  icon={
                    openDropdown === "management" ? faChevronUp : faChevronDown
                  }
                  className="ml-2 text-xs"
                />
              </div>
              {openDropdown === "management" && (
                <ul className="md:absolute left-0 mt-1 w-full md:w-48 bg-[#031D40] rounded-lg shadow-lg z-10 border border-[#032059]">
                  {managementLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      icon={link.icon}
                      text={link.text}
                      onClick={closeMenu}
                      disabled={!isAuthenticated}
                    />
                  ))}
                </ul>
              )}
            </li>

            {/* Menú desplegable para Transacciones */}
            <li className="relative group">
              <div
                className="flex items-center px-3 py-2 rounded-lg transition-colors text-white hover:bg-[#032059] hover:text-[#F2B705] cursor-pointer"
                onClick={() => toggleDropdown("transactions")}
              >
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                <span className="hidden sm:inline">Transacciones</span>
                <FontAwesomeIcon
                  icon={
                    openDropdown === "transactions"
                      ? faChevronUp
                      : faChevronDown
                  }
                  className="ml-2 text-xs"
                />
              </div>
              {openDropdown === "transactions" && (
                <ul className="md:absolute left-0 mt-1 w-full md:w-48 bg-[#031D40] rounded-lg shadow-lg z-10 border border-[#032059]">
                  {transactionLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      icon={link.icon}
                      text={link.text}
                      onClick={closeMenu}
                      disabled={!isAuthenticated}
                    />
                  ))}
                </ul>
              )}
            </li>

            {/* Menú desplegable para Finanzas */}
            <li className="relative group">
              <div
                className="flex items-center px-3 py-2 rounded-lg transition-colors text-white hover:bg-[#032059] hover:text-[#F2B705] cursor-pointer"
                onClick={() => toggleDropdown("financial")}
              >
                <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                <span className="hidden sm:inline">Finanzas</span>
                <FontAwesomeIcon
                  icon={
                    openDropdown === "financial" ? faChevronUp : faChevronDown
                  }
                  className="ml-2 text-xs"
                />
              </div>
              {openDropdown === "financial" && (
                <ul className="md:absolute left-0 mt-1 w-full md:w-48 bg-[#031D40] rounded-lg shadow-lg z-10 border border-[#032059]">
                  {financialLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      icon={link.icon}
                      text={link.text}
                      onClick={closeMenu}
                      disabled={!isAuthenticated}
                    />
                  ))}
                </ul>
              )}
            </li>
          </ul>

          {/* Área de usuario */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0 md:ml-6 border-t md:border-t-0 border-[#032059] pt-4 md:pt-0 w-full md:w-auto">
            {isAuthenticated ? (
              <>
                {user && (
                  <div className="flex items-center text-white">
                    <div className="w-8 h-8 rounded-full bg-[#F2B705] flex items-center justify-center text-[#031D40] font-bold mr-2">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm hidden md:inline">
                      {user.email}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md w-full md:w-auto justify-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex items-center bg-[#F2B705] hover:bg-[#e0a904] text-[#031D40] font-semibold px-4 py-2 rounded-lg transition-colors shadow-md w-full md:w-auto justify-center"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                <span>Iniciar sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
