import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Actualizar un detalle de venta (PATCH)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const detalleVentaId = parseInt(params.id);

    if (isNaN(detalleVentaId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { venta_id, producto_id, cantidad, precio_unitario } = body;

    // Validaciones
    if (!venta_id || isNaN(venta_id)) {
      return NextResponse.json(
        { success: false, message: "ID de venta inválido" },
        { status: 400 }
      );
    }

    if (!producto_id || isNaN(producto_id)) {
      return NextResponse.json(
        { success: false, message: "ID de producto inválido" },
        { status: 400 }
      );
    }

    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
      return NextResponse.json(
        { success: false, message: "Cantidad inválida" },
        { status: 400 }
      );
    }

    if (!precio_unitario || isNaN(precio_unitario) || precio_unitario <= 0) {
      return NextResponse.json(
        { success: false, message: "Precio unitario inválido" },
        { status: 400 }
      );
    }

    // Calcular subtotal automáticamente
    const subtotal = parseFloat(precio_unitario) * parseInt(cantidad);

    // Actualizar el detalle de venta
    const detalleActualizado = await prisma.detalleVentas.update({
      where: { detalle_venta_id: detalleVentaId },
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
            nombre: true, // Replace with the correct field name from your Prisma schema
          },
        },
      },
    });

    // Actualizar el total de la venta
    await prisma.ventas.update({
      where: { venta_id: parseInt(venta_id) },
      data: {
        total_venta: {
          increment:
            subtotal - (Number(detalleActualizado.subtotal) - subtotal),
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Detalle de venta actualizado exitosamente",
        data: detalleActualizado,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en PATCH /api/detalle-ventas/[id]:", error.message);

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Detalle de venta no encontrado" },
        { status: 404 }
      );
    }

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
        message: "Error actualizando el detalle de venta",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Eliminar un detalle de venta (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const detalleVentaId = parseInt(params.id);

    if (isNaN(detalleVentaId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Obtener el detalle antes de eliminarlo para actualizar el total
    const detalle = await prisma.detalleVentas.findUnique({
      where: { detalle_venta_id: detalleVentaId },
    });

    if (!detalle) {
      return NextResponse.json(
        { success: false, message: "Detalle de venta no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el detalle de venta
    await prisma.detalleVentas.delete({
      where: { detalle_venta_id: detalleVentaId },
    });

    // Actualizar el total de la venta
    await prisma.ventas.update({
      where: { venta_id: detalle.venta_id },
      data: {
        total_venta: {
          decrement: detalle.subtotal,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Detalle de venta eliminado exitosamente",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en DELETE /api/detalle-ventas/[id]:", error.message);

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Detalle de venta no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error eliminando el detalle de venta",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
