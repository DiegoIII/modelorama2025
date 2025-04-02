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

    // Validaciones
    if (!proveedor_id || isNaN(proveedor_id)) {
      return NextResponse.json(
        { success: false, message: "ID de proveedor inválido" },
        { status: 400 }
      );
    }

    if (total_compra === undefined || isNaN(parseFloat(total_compra))) {
      return NextResponse.json(
        { success: false, message: "Total de compra inválido" },
        { status: 400 }
      );
    }

    // Actualizar la compra
    const compraActualizada = await prisma.compras.update({
      where: { compra_id: compraId },
      data: {
        proveedor_id: parseInt(proveedor_id),
        fecha_compra: fecha_compra ? new Date(fecha_compra) : undefined,
        total_compra: parseFloat(total_compra),
      },
      include: {
        proveedor: true,
        detalleCompras: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Compra actualizada exitosamente",
        data: compraActualizada,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en PATCH /api/compras/[id]:", error.message);

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Compra no encontrada" },
        { status: 404 }
      );
    }

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
        message: "Error actualizando la compra",
        error: error.message,
      },
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

    // Verificar si hay detalles de compra asociados primero
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
      {
        success: true,
        message: "Compra eliminada exitosamente",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en DELETE /api/compras/[id]:", error.message);

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Compra no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error eliminando la compra",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
