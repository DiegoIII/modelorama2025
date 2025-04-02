import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todas las compras (GET)
 */
export async function GET() {
  try {
    const compras = await prisma.compras.findMany({
      include: {
        proveedor: {
          select: {
            proveedor_id: true,
            nombre_proveedor: true,
          },
        },
        detalleCompras: {
          include: {
            producto: {
              select: {
                producto_id: true,
                // nombre_producto: true, // Ensure this property exists in your schema or remove it
              },
            },
          },
        },
      },
      orderBy: {
        fecha_compra: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: compras,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en GET /api/compras:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Error obteniendo las compras",
        error: error.message,
      },
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

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Cuerpo de la solicitud inválido" },
        { status: 400 }
      );
    }

    const { proveedor_id, fecha_compra, total_compra } = body;

    // Validaciones
    if (!proveedor_id || isNaN(proveedor_id)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "El ID de proveedor es obligatorio y debe ser un número válido",
        },
        { status: 400 }
      );
    }

    if (!total_compra || isNaN(total_compra)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "El total de la compra es obligatorio y debe ser un número válido",
        },
        { status: 400 }
      );
    }

    const nuevaCompra = await prisma.compras.create({
      data: {
        proveedor_id: parseInt(proveedor_id),
        fecha_compra: fecha_compra ? new Date(fecha_compra) : new Date(),
        total_compra: parseFloat(total_compra),
      },
      include: {
        proveedor: {
          select: {
            proveedor_id: true,
            nombre_proveedor: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Compra creada exitosamente",
        data: nuevaCompra,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error en POST /api/compras:", error.message);

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          message: "El proveedor especificado no existe",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error creando la compra",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
