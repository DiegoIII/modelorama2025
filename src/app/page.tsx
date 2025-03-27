import Navbar from "app/components/Navbar";
import React from "react";
import Layout from "app/layout/Layout";

const PageLayout = () => {
  return (
    <>
      <Layout>
        <section className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">
            Bienvenido a nuestra aplicación
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Funcionalidad 1</h2>
              <p>Descripción de la primera funcionalidad importante.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Funcionalidad 2</h2>
              <p>Descripción de la segunda funcionalidad importante.</p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default PageLayout;
