import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Helper para extraer mensajes de error
const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Error desconocido";

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
        data: detallesCompras.map((detalle) => ({
          ...detalle,
          precio_unitario: Number(detalle.precio_unitario),
          subtotal: Number(detalle.subtotal),
          producto: detalle.producto
            ? {
                ...detalle.producto,
                precio_venta: Number(detalle.producto.precio_venta),
              }
            : null,
        })),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error en GET /api/detalle-compras:", getErrorMessage(error));
    return NextResponse.json(
      {
        success: false,
        message: "Error obteniendo los detalles de compras",
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

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

    const subtotal = Number(precio_unitario) * Number(cantidad);

    const nuevoDetalle = await prisma.detalleCompras.create({
      data: {
        compra_id: Number(compra_id),
        producto_id: Number(producto_id),
        cantidad: Number(cantidad),
        precio_unitario: Number(precio_unitario),
        subtotal: subtotal,
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
            precio_venta: true,
          },
        },
      },
    });

    // Actualizar el total de la compra
    await prisma.compras.update({
      where: { compra_id: Number(compra_id) },
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
        data: {
          ...nuevoDetalle,
          precio_unitario: Number(nuevoDetalle.precio_unitario),
          subtotal: Number(nuevoDetalle.subtotal),
          producto: nuevoDetalle.producto
            ? {
                ...nuevoDetalle.producto,
                precio_venta: Number(nuevoDetalle.producto.precio_venta),
              }
            : null,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "Error en POST /api/detalle-compras:",
      getErrorMessage(error)
    );
    // En caso de error en Prisma, verificamos el código
    if (
      error instanceof Error &&
      // Utilizamos (error as any).code para extraer el código sin usar explicit any en la firma
      (error as { code?: string }).code === "P2003"
    ) {
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
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
