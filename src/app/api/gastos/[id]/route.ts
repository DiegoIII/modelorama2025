import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Actualizar un gasto (PATCH)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gastoId = parseInt(params.id);

    if (isNaN(gastoId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { descripcion, monto, categoria_gasto_id } = body;

    // Validar que al menos un campo esté presente para actualizar
    if (!descripcion && !monto && !categoria_gasto_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Debe proporcionar al menos un campo para actualizar",
        },
        { status: 400 }
      );
    }

    // Validar si la categoría de gasto existe (si se proporciona)
    if (categoria_gasto_id) {
      const categoriaExiste = await prisma.categoriasGastos.findUnique({
        where: { categoria_gasto_id },
      });

      if (!categoriaExiste) {
        return NextResponse.json(
          { success: false, message: "Categoría de gasto no encontrada" },
          { status: 404 }
        );
      }
    }

    // Actualizar el gasto
    const gastoActualizado = await prisma.gastos.update({
      where: { gasto_id: gastoId },
      data: {
        descripcion,
        monto,
        categoria_gasto_id,
      },
    });

    return NextResponse.json(
      { success: true, data: gastoActualizado },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/gastos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando el gasto" },
      { status: 500 }
    );
  }
}

/**
 * Eliminar un gasto (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gastoId = parseInt(params.id);

    if (isNaN(gastoId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Verificar si el gasto existe antes de eliminarlo
    const gastoExiste = await prisma.gastos.findUnique({
      where: { gasto_id: gastoId },
    });

    if (!gastoExiste) {
      return NextResponse.json(
        { success: false, message: "Gasto no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el gasto
    await prisma.gastos.delete({
      where: { gasto_id: gastoId },
    });

    return NextResponse.json(
      { success: true, message: "Gasto eliminado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/gastos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando el gasto" },
      { status: 500 }
    );
  }
}
