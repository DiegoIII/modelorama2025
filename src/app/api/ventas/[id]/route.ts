import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Actualizar una venta (PATCH)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ventaId = parseInt(params.id);

    if (isNaN(ventaId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { fecha_venta, total_venta, detalleVentas } = body;

    // Verificar si la venta existe
    const ventaExiste = await prisma.ventas.findUnique({
      where: { venta_id: ventaId },
    });

    if (!ventaExiste) {
      return NextResponse.json(
        { success: false, message: "Venta no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar la venta
    const ventaActualizada = await prisma.ventas.update({
      where: { venta_id: ventaId },
      data: {
        fecha_venta: fecha_venta ? new Date(fecha_venta) : undefined,
        total_venta,
        detalleVentas: detalleVentas ? { set: detalleVentas } : undefined,
      },
    });

    return NextResponse.json(
      { success: true, data: ventaActualizada },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/ventas/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando la venta" },
      { status: 500 }
    );
  }
}

/**
 * Eliminar una venta (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ventaId = parseInt(params.id);

    if (isNaN(ventaId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Verificar si la venta existe antes de eliminarla
    const ventaExiste = await prisma.ventas.findUnique({
      where: { venta_id: ventaId },
    });

    if (!ventaExiste) {
      return NextResponse.json(
        { success: false, message: "Venta no encontrada" },
        { status: 404 }
      );
    }

    // Verificar si hay detalles de venta asociados
    const detallesAsociados = await prisma.detalleVentas.findFirst({
      where: { venta_id: ventaId },
    });

    if (detallesAsociados) {
      return NextResponse.json(
        {
          success: false,
          message: "No se puede eliminar la venta, tiene detalles asociados",
        },
        { status: 400 }
      );
    }

    // Eliminar la venta
    await prisma.ventas.delete({
      where: { venta_id: ventaId },
    });

    return NextResponse.json(
      { success: true, message: "Venta eliminada" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/ventas/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando la venta" },
      { status: 500 }
    );
  }
}
