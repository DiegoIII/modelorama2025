import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todos los detalles de ventas (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todos los detalles de ventas...");

    const detallesVentas = await prisma.detalleVentas.findMany();

    return NextResponse.json(detallesVentas, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/detalle-ventas:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo los detalles de ventas" },
      { status: 500 }
    );
  }
}

/**
 * Crear un nuevo detalle de venta (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { venta_id, producto_id, cantidad, precio_unitario } = body;

    if (!venta_id || !producto_id || !cantidad || !precio_unitario) {
      return NextResponse.json(
        { success: false, message: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const nuevoDetalleVenta = await prisma.detalleVentas.create({
      data: {
        venta_id,
        producto_id,
        cantidad,
        precio_unitario,
      },
    });

    return NextResponse.json(
      { success: true, data: nuevoDetalleVenta },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/detalle-ventas:", error);
    return NextResponse.json(
      { success: false, message: "Error creando el detalle de venta" },
      { status: 500 }
    );
  }
}
