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
        detalleVentas: true, // Se incluyen los detalles de venta
      },
    });

    // Se mapea cada venta para agregar la propiedad "detalles"
    const formattedVentas = ventas.map((venta) => ({
      ...venta,
      detalles: venta.detalleVentas, // Renombramos 'detalleVentas' a 'detalles'
    }));

    return NextResponse.json(
      { success: true, data: formattedVentas },
      { status: 200 }
    );
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
    // Se espera que el frontend envíe { total_venta, detalles, [fecha_venta] }
    const { fecha_venta, total_venta, detalles } = body;

    if (!total_venta || !detalles || !Array.isArray(detalles)) {
      return NextResponse.json(
        {
          success: false,
          message: "El total de venta y los detalles de venta son obligatorios",
        },
        { status: 400 }
      );
    }

    // Transformamos cada detalle para crear el detalle de venta
    // Se espera que cada detalle incluya "producto_id", "cantidad" y "precio"
    interface Detalle {
      producto_id: number;
      cantidad: number;
      precio: number;
    }

    const detallesTransformed = detalles.map((detalle: Detalle) => ({
      producto_id: detalle.producto_id,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio,
      subtotal: detalle.cantidad * detalle.precio,
    }));

    const nuevaVenta = await prisma.ventas.create({
      data: {
        fecha_venta: fecha_venta ? new Date(fecha_venta) : undefined,
        total_venta,
        detalleVentas: {
          create: detallesTransformed,
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
