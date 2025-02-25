import Footer from "app/components/Footer";
import Navbar from "app/components/Navbar";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <div className="mt -m-4">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
