import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todos los detalles de compras (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todos los detalles de compras...");

    const detallesCompras = await prisma.detalleCompras.findMany();

    return NextResponse.json(detallesCompras, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/detalles-compras:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo los detalles de compras" },
      { status: 500 }
    );
  }
}

/**
 * Crear un nuevo detalle de compra (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { compra_id, producto_id, cantidad, precio_unitario, subtotal } =
      body;

    if (
      !compra_id ||
      !producto_id ||
      !cantidad ||
      !precio_unitario ||
      !subtotal
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Todos los campos son obligatorios",
        },
        { status: 400 }
      );
    }

    const nuevoDetalleCompra = await prisma.detalleCompras.create({
      data: {
        compra_id,
        producto_id,
        cantidad,
        precio_unitario,
        subtotal,
      },
    });

    return NextResponse.json(
      { success: true, data: nuevoDetalleCompra },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/detalles-compras:", error);
    return NextResponse.json(
      { success: false, message: "Error creando el detalle de compra" },
      { status: 500 }
    );
  }
}
