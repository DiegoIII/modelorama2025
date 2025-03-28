import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Actualizar un detalle de compra (PATCH)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const detalleCompraId = parseInt(params.id);

    if (isNaN(detalleCompraId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { compra_id, producto_id, cantidad, precio_unitario, subtotal } =
      body;

    // Verificar si el detalle de compra existe
    const detalleExiste = await prisma.detalleCompras.findUnique({
      where: { detalle_compra_id: detalleCompraId },
    });

    if (!detalleExiste) {
      return NextResponse.json(
        { success: false, message: "Detalle de compra no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar el detalle de compra
    const detalleActualizado = await prisma.detalleCompras.update({
      where: { detalle_compra_id: detalleCompraId },
      data: {
        compra_id,
        producto_id,
        cantidad,
        precio_unitario,
        subtotal,
      },
    });

    return NextResponse.json(
      { success: true, data: detalleActualizado },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/detalle-compras/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando el detalle de compra" },
      { status: 500 }
    );
  }
}

/**
 * Eliminar un detalle de compra (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const detalleCompraId = parseInt(params.id);

    if (isNaN(detalleCompraId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Verificar si el detalle de compra existe antes de eliminarlo
    const detalleExiste = await prisma.detalleCompras.findUnique({
      where: { detalle_compra_id: detalleCompraId },
    });

    if (!detalleExiste) {
      return NextResponse.json(
        { success: false, message: "Detalle de compra no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el detalle de compra
    await prisma.detalleCompras.delete({
      where: { detalle_compra_id: detalleCompraId },
    });

    return NextResponse.json(
      { success: true, message: "Detalle de compra eliminado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/detalle-compras/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando el detalle de compra" },
      { status: 500 }
    );
  }
}
