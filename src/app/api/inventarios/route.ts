import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todos los inventarios (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todos los inventarios...");

    const inventarios = await prisma.inventario.findMany({
      include: {
        producto: true, // Incluye información del producto relacionado
      },
    });

    return NextResponse.json(inventarios, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/inventarios:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo los inventarios" },
      { status: 500 }
    );
  }
}

/**
 * Crear un nuevo inventario (POST)
 */
export async function POST(req: NextRequest) {
  try {
    // Verificar si el request tiene contenido
    if (!req.body) {
      return NextResponse.json(
        { success: false, message: "El cuerpo de la solicitud está vacío" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "El formato de la solicitud no es válido" },
        { status: 400 }
      );
    }

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
    console.error("Error en POST /api/inventarios:", error);

    return NextResponse.json(
      { success: false, message: "Error creando el inventario" },
      { status: 500 }
    );
  }
}
