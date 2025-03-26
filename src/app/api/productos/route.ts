import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Verificar que el cuerpo existe
    if (!req.body) {
      return NextResponse.json(
        { error: "Cuerpo de la solicitud faltante" },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log("Datos recibidos:", body);

    // Validación básica
    if (!body.nombre || !body.precio_compra || !body.precio_venta) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    // Crear producto con valores por defecto
    const nuevoProducto = await prisma.productos.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion || "",
        precio_compra: parseFloat(body.precio_compra),
        precio_venta: parseFloat(body.precio_venta),
        categoria_id: parseInt(body.categoria_id) || 1, // Valor por defecto
        proveedor_id: parseInt(body.proveedor_id) || 1, // Valor por defecto
        stock_minimo: parseInt(body.stock_minimo) || 0,
        stock_maximo: parseInt(body.stock_maximo) || 100,
      },
    });

    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    console.error("Error detallado:", error);
    return NextResponse.json(
      {
        error: "Error al crear producto",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
