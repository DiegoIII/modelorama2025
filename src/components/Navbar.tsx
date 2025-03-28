import Link from "next/link";
import React from "react";
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
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

interface NavLinkProps {
  href: string;
  icon: IconDefinition;
  text: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, text }) => {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center px-3 py-2 rounded-lg transition-colors
        text-white hover:bg-[#032059] hover:text-[#F2B705]"
      >
        <FontAwesomeIcon icon={icon} className="mr-2" />
        <span className="hidden sm:inline">{text}</span>
      </Link>
    </li>
  );
};

const Navbar: React.FC = () => {
  const navLinks = [
    { href: "/", icon: faHome, text: "Inicio" },
    {
      href: "/categoria-gastos",
      icon: faCoins,
      text: "Categoría Gastos",
    },
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

  return (
    <nav className="bg-[#031D40] p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-[#F2B705] text-xl font-bold mb-4 md:mb-0 flex items-center">
          <FontAwesomeIcon icon={faBeer} className="mr-2" />
          Modelorama
        </div>

        <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
