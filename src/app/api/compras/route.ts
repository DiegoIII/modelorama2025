import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todas las compras (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todas las compras...");

    const compras = await prisma.compras.findMany({
      include: {
        proveedor: true,
        detalleCompras: true,
      },
    });

    return NextResponse.json(compras, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/compras:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo las compras" },
      { status: 500 }
    );
  }
}

/**
 * Crear una nueva compra (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { proveedor_id, fecha_compra, total_compra } = body;

    if (!proveedor_id || !total_compra) {
      return NextResponse.json(
        {
          success: false,
          message: "El proveedor y el total de la compra son obligatorios",
        },
        { status: 400 }
      );
    }

    const nuevaCompra = await prisma.compras.create({
      data: {
        proveedor_id,
        fecha_compra: fecha_compra ? new Date(fecha_compra) : undefined,
        total_compra,
      },
    });

    return NextResponse.json(
      { success: true, data: nuevaCompra },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/compras:", error);
    return NextResponse.json(
      { success: false, message: "Error creando la compra" },
      { status: 500 }
    );
  }
}
