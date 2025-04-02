import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
/**
 * Obtener todos los detalles de compras (GET)
 */
export async function GET() {
  try {
    const detallesCompras = await prisma.detalleCompras.findMany({
      include: {
        compra: {
          select: {
            compra_id: true,
            fecha_compra: true,
            total_compra: true,
          },
        },
        producto: {
          select: {
            producto_id: true,
            nombre: true,
            precio_venta: true,
          },
        },
      },
      orderBy: {
        detalle_compra_id: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: detallesCompras,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en GET /api/detalle-compras:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Error obteniendo los detalles de compras",
        error: error.message,
      },
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

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Cuerpo de la solicitud inválido" },
        { status: 400 }
      );
    }

    const { compra_id, producto_id, cantidad, precio_unitario } = body;

    // Validaciones
    if (!compra_id || isNaN(compra_id)) {
      return NextResponse.json(
        {
          success: false,
          message: "El ID de compra es obligatorio y debe ser un número válido",
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

    const nuevoDetalle = await prisma.detalleCompras.create({
      data: {
        compra_id: parseInt(compra_id),
        producto_id: parseInt(producto_id),
        cantidad: parseInt(cantidad),
        precio_unitario: parseFloat(precio_unitario),
        subtotal,
      },
      include: {
        compra: {
          select: {
            compra_id: true,
            fecha_compra: true,
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

    // Actualizar el total de la compra
    await prisma.compras.update({
      where: { compra_id: parseInt(compra_id) },
      data: {
        total_compra: {
          increment: subtotal,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Detalle de compra creado exitosamente",
        data: nuevoDetalle,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error en POST /api/detalle-compras:", error.message);

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          message: "La compra o producto especificado no existe",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error creando el detalle de compra",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
