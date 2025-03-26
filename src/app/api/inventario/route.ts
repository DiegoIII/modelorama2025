import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todos los inventario (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todos los inventario...");

    const inventario = await prisma.inventario.findMany({
      include: {
        producto: true, // Incluye información relacionada del producto
      },
    });

    return NextResponse.json(inventario, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/inventario:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo los inventario" },
      { status: 500 }
    );
  }
}

/**
 * Crear un nuevo inventario (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { producto_id, cantidad } = body;

    if (!producto_id || !cantidad) {
      return NextResponse.json(
        {
          success: false,
          message: "El ID del producto y la cantidad son obligatorios",
        },
        { status: 400 }
      );
    }

    const nuevoInventario = await prisma.inventario.create({
      data: {
        producto_id,
        cantidad,
      },
    });

    return NextResponse.json(
      { success: true, data: nuevoInventario },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/inventario:", error);
    return NextResponse.json(
      { success: false, message: "Error creando el inventario" },
      { status: 500 }
    );
  }
}
