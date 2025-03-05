import Link from "next/link";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">MiLogo</div>
        <ul className="flex space-x-4">
          <div className="hidden md:flex space-x-6"></div>
          <Link href={"/"}>Inicio</Link>
          <Link href={"/productos"}>productos</Link>
          <Link href={"/inventarios"}>inventarios</Link>
          <Link href={"/detalleventas"}>detalleventas</Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
