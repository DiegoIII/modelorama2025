import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faHandshake,
  faEnvelope,
  faBeer,
} from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#031D40] text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          {/* Sección izquierda - Logo y derechos */}
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <h3 className="text-xl font-bold text-[#F2B705] flex items-center justify-center lg:justify-start">
              <FontAwesomeIcon icon={faBeer} className="mr-2" />
              Modelorama
            </h3>
            <p className="text-sm mt-2 text-gray-300">
              © {new Date().getFullYear()} Todos los derechos reservados.
            </p>
          </div>

          {/* Sección central - Enlaces rápidos */}
          <div className="mb-6 lg:mb-0">
            <h4 className="text-[#F2B705] font-semibold text-center mb-3">
              Enlaces Rápidos
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <FooterLink href="#" icon={faHome} text="Inicio" />
              <FooterLink href="#" icon={faInfoCircle} text="Acerca de" />
              <FooterLink href="#" icon={faHandshake} text="Servicios" />
              <FooterLink href="#" icon={faEnvelope} text="Contacto" />
            </div>
          </div>

          {/* Sección derecha - Información de contacto */}
          <div className="text-center lg:text-right">
            <h4 className="text-[#F2B705] font-semibold mb-3">Contacto</h4>
            <p className="text-sm text-gray-300 mb-1">
              <i className="mr-2">📧</i> contacto@modelorama.com
            </p>
            <p className="text-sm text-gray-300 mb-1">
              <i className="mr-2">📱</i> +1 234 567 890
            </p>
            <p className="text-sm text-gray-300">
              <i className="mr-2">🏢</i> Av. Principal 123, Ciudad
            </p>
          </div>
        </div>

        {/* División y créditos */}
        <div className="mt-8 pt-6 border-t border-[#032059]">
          <p className="text-sm text-gray-400 text-center">
            Desarrollado por{" "}
            <a href="#" className="text-[#F2B705] hover:underline">
              Equipo Uno
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ href: string; icon: any; text: string }> = ({
  href,
  icon,
  text,
}) => {
  return (
    <a
      href={href}
      className="flex items-center text-gray-300 hover:text-[#F2B705] transition duration-300 text-sm"
    >
      <FontAwesomeIcon icon={icon} className="mr-2" />
      {text}
    </a>
  );
};

export default Footer;
