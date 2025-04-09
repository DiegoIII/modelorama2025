import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ventaId = parseInt(params.id);

    if (isNaN(ventaId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de venta inválido",
          details: `El ID proporcionado (${params.id}) no es un número válido`,
        },
        { status: 400 }
      );
    }

    // Verificar si la venta existe y obtener sus detalles
    const venta = await prisma.ventas.findUnique({
      where: { venta_id: ventaId },
      include: {
        detalleVentas: true,
      },
    });

    if (!venta) {
      return NextResponse.json(
        {
          success: false,
          message: "Venta no encontrada",
          details: `No se encontró una venta con ID ${ventaId}`,
        },
        { status: 404 }
      );
    }

    // Primero eliminar los detalles asociados
    if (venta.detalleVentas.length > 0) {
      await prisma.detalleVentas.deleteMany({
        where: { venta_id: ventaId },
      });
    }

    // Luego eliminar la venta
    await prisma.ventas.delete({
      where: { venta_id: ventaId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Venta eliminada exitosamente",
        deletedVentaId: ventaId,
        deletedDetailsCount: venta.detalleVentas.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en DELETE /api/ventas/[id]:", error);

    // Manejo de errores específicos de Prisma
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Venta no encontrada",
          errorCode: error.code,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error interno al eliminar la venta",
        error: error.message,
        ...(error.code && { errorCode: error.code }),
      },
      { status: 500 }
    );
  }
}
