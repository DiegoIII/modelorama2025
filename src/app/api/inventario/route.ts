import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todos los registros de inventario (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todos los registros de inventario...");

    const inventario = await prisma.inventario.findMany({
      include: {
        producto: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        fecha_actualizacion: "desc",
      },
    });

    return NextResponse.json(
      { success: true, data: inventario },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en GET /api/inventario:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo el inventario" },
      { status: 500 }
    );
  }
}

/**
 * Crear un nuevo registro de inventario (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { producto_id, cantidad, fecha_actualizacion } = body;

    // Validar campos requeridos
    if (!producto_id || cantidad === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "producto_id y cantidad son campos requeridos",
        },
        { status: 400 }
      );
    }

    // Verificar si el producto existe
    const productoExiste = await prisma.productos.findUnique({
      where: { producto_id: Number(producto_id) },
    });

    if (!productoExiste) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Validar que la cantidad sea un número válido
    if (isNaN(Number(cantidad))) {
      return NextResponse.json(
        { success: false, message: "La cantidad debe ser un número válido" },
        { status: 400 }
      );
    }

    // Crear el registro de inventario
    const nuevoRegistro = await prisma.inventario.create({
      data: {
        producto_id: Number(producto_id),
        cantidad: Number(cantidad),
        fecha_actualizacion: fecha_actualizacion || new Date(),
      },
    });

    return NextResponse.json(
      { success: true, data: nuevoRegistro },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/inventario:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creando el registro de inventario",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
