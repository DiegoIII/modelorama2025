import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todos los detalles de ventas (GET)
 */
export async function GET() {
  try {
    const detallesVentas = await prisma.detalleVentas.findMany({
      include: {
        venta: {
          select: {
            venta_id: true,
            fecha_venta: true,
            total_venta: true,
          },
        },
        producto: {
          select: {
            producto_id: true,
            nombre: true, // Assuming the correct property name is 'nombre'
            precio_venta: true,
          },
        },
      },
      orderBy: {
        detalle_venta_id: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: detallesVentas,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en GET /api/detalle-ventas:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Error obteniendo los detalles de ventas",
        error: error.message,
      },
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

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Cuerpo de la solicitud inválido" },
        { status: 400 }
      );
    }

    const { venta_id, producto_id, cantidad, precio_unitario } = body;

    // Validaciones
    if (!venta_id || isNaN(venta_id)) {
      return NextResponse.json(
        {
          success: false,
          message: "El ID de venta es obligatorio y debe ser un número válido",
        },
        { status: 400 }
      );
    }

    if (!producto_id || isNaN(producto_id)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "El ID de producto es obligatorio y debe ser un número válido",
        },
        { status: 400 }
      );
    }

    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "La cantidad es obligatoria y debe ser un número positivo",
        },
        { status: 400 }
      );
    }

    if (!precio_unitario || isNaN(precio_unitario) || precio_unitario <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "El precio unitario es obligatorio y debe ser un número positivo",
        },
        { status: 400 }
      );
    }

    // Calcular subtotal automáticamente
    const subtotal = parseFloat(precio_unitario) * parseInt(cantidad);

    const nuevoDetalle = await prisma.detalleVentas.create({
      data: {
        venta_id: parseInt(venta_id),
        producto_id: parseInt(producto_id),
        cantidad: parseInt(cantidad),
        precio_unitario: parseFloat(precio_unitario),
        subtotal,
      },
      include: {
        venta: {
          select: {
            venta_id: true,
            fecha_venta: true,
          },
        },
        producto: {
          select: {
            producto_id: true,
            nombre: true,
          },
        },
      },
    });

    // Actualizar el total de la venta
    await prisma.ventas.update({
      where: { venta_id: parseInt(venta_id) },
      data: {
        total_venta: {
          increment: subtotal,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Detalle de venta creado exitosamente",
        data: nuevoDetalle,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error en POST /api/detalle-ventas:", error.message);

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          message: "La venta o producto especificado no existe",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error creando el detalle de venta",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
