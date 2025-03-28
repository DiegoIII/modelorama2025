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
    const { venta_id, producto_id, cantidad, precio_unitario, subtotal } = body;

    if (
      !venta_id ||
      !producto_id ||
      !cantidad ||
      !precio_unitario ||
      !subtotal
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Todos los campos son obligatorios para actualizar",
        },
        { status: 400 }
      );
    }

    // Verificar si el detalle de venta existe
    const detalleVentaExiste = await prisma.detalleVentas.findUnique({
      where: { detalle_venta_id: detalleVentaId },
    });

    if (!detalleVentaExiste) {
      return NextResponse.json(
        { success: false, message: "Detalle de venta no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar el detalle de venta
    const detalleVentaActualizado = await prisma.detalleVentas.update({
      where: { detalle_venta_id: detalleVentaId },
      data: {
        venta_id,
        producto_id,
        cantidad,
        precio_unitario,
        subtotal,
      },
    });

    return NextResponse.json(
      { success: true, data: detalleVentaActualizado },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/detalle-ventas/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando el detalle de venta" },
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

    // Verificar si el detalle de venta existe antes de eliminarlo
    const detalleVentaExiste = await prisma.detalleVentas.findUnique({
      where: { detalle_venta_id: detalleVentaId },
    });

    if (!detalleVentaExiste) {
      return NextResponse.json(
        { success: false, message: "Detalle de venta no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si el detalle de venta está asociado a alguna venta
    const ventaAsociada = await prisma.ventas.findFirst({
      where: { venta_id: detalleVentaExiste.venta_id },
    });

    if (ventaAsociada) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No se puede eliminar el detalle de venta, está asociado a una venta existente",
        },
        { status: 400 }
      );
    }

    // Eliminar el detalle de venta
    await prisma.detalleVentas.delete({
      where: { detalle_venta_id: detalleVentaId },
    });

    return NextResponse.json(
      { success: true, message: "Detalle de venta eliminado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/detalle-ventas/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando el detalle de venta" },
      { status: 500 }
    );
  }
}
