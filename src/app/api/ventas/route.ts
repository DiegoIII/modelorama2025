import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todas las ventas (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todas las ventas...");

    const ventas = await prisma.ventas.findMany({
      include: {
        detalleVentas: true, // Incluir detalles de venta
      },
    });

    return NextResponse.json(ventas, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/ventas:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo las ventas" },
      { status: 500 }
    );
  }
}

/**
 * Crear una nueva venta (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fecha_venta, total_venta, detalleVentas } = body;

    if (!total_venta || !detalleVentas || !Array.isArray(detalleVentas)) {
      return NextResponse.json(
        {
          success: false,
          message: "El total de venta y los detalles de venta son obligatorios",
        },
        { status: 400 }
      );
    }

    const nuevaVenta = await prisma.ventas.create({
      data: {
        fecha_venta: fecha_venta ? new Date(fecha_venta) : undefined,
        total_venta,
        detalleVentas: {
          create: detalleVentas,
        },
      },
    });

    return NextResponse.json(
      { success: true, data: nuevaVenta },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/ventas:", error);
    return NextResponse.json(
      { success: false, message: "Error creando la venta" },
      { status: 500 }
    );
  }
}
