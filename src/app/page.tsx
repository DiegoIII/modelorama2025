"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState({ saludo: "" });

  const saludoBack = () => {
    fetch("/api/saludar")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };

  return (
    <>
      <h1>Mi proyecto</h1>
      <button onClick={saludoBack}>Saludar</button>
      <h2>{data.saludo}</h2>
    </>
  );
}
