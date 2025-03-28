import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Actualizar una compra (PATCH)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const compraId = parseInt(params.id);

    if (isNaN(compraId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { proveedor_id, fecha_compra, total_compra } = body;

    // Verificar si la compra existe
    const compraExiste = await prisma.compras.findUnique({
      where: { compra_id: compraId },
    });

    if (!compraExiste) {
      return NextResponse.json(
        { success: false, message: "Compra no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar la compra
    const compraActualizada = await prisma.compras.update({
      where: { compra_id: compraId },
      data: {
        proveedor_id,
        fecha_compra,
        total_compra,
      },
    });

    return NextResponse.json(
      { success: true, data: compraActualizada },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/compras/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando la compra" },
      { status: 500 }
    );
  }
}

/**
 * Eliminar una compra (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const compraId = parseInt(params.id);

    if (isNaN(compraId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Verificar si la compra existe antes de eliminarla
    const compraExiste = await prisma.compras.findUnique({
      where: { compra_id: compraId },
    });

    if (!compraExiste) {
      return NextResponse.json(
        { success: false, message: "Compra no encontrada" },
        { status: 404 }
      );
    }

    // Verificar si hay detalles de compra asociados
    const detallesAsociados = await prisma.detalleCompras.findFirst({
      where: { compra_id: compraId },
    });

    if (detallesAsociados) {
      return NextResponse.json(
        {
          success: false,
          message: "No se puede eliminar la compra, tiene detalles asociados",
        },
        { status: 400 }
      );
    }

    // Eliminar la compra
    await prisma.compras.delete({
      where: { compra_id: compraId },
    });

    return NextResponse.json(
      { success: true, message: "Compra eliminada" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/compras/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando la compra" },
      { status: 500 }
    );
  }
}
