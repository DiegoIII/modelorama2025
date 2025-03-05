import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Actualizar una categoría de gasto (PATCH)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoriaId = parseInt(params.id);

    if (isNaN(categoriaId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { nombre_categoria_gasto } = body;

    if (!nombre_categoria_gasto) {
      return NextResponse.json(
        {
          success: false,
          message: "Debe proporcionar un nombre para actualizar",
        },
        { status: 400 }
      );
    }

    // Verificar si la categoría de gasto existe
    const categoriaExiste = await prisma.categoriasGastos.findUnique({
      where: { categoria_gasto_id: categoriaId },
    });

    if (!categoriaExiste) {
      return NextResponse.json(
        { success: false, message: "Categoría de gasto no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar la categoría de gasto
    const categoriaActualizada = await prisma.categoriasGastos.update({
      where: { categoria_gasto_id: categoriaId },
      data: {
        nombre_categoria_gasto,
      },
    });

    return NextResponse.json(
      { success: true, data: categoriaActualizada },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/categorias-gastos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando la categoría de gasto" },
      { status: 500 }
    );
  }
}

/**
 * Eliminar una categoría de gasto (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoriaId = parseInt(params.id);

    if (isNaN(categoriaId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Verificar si la categoría de gasto existe antes de eliminarla
    const categoriaExiste = await prisma.categoriasGastos.findUnique({
      where: { categoria_gasto_id: categoriaId },
    });

    if (!categoriaExiste) {
      return NextResponse.json(
        { success: false, message: "Categoría de gasto no encontrada" },
        { status: 404 }
      );
    }

    // Verificar si hay gastos asociados a la categoría
    const gastosAsociados = await prisma.gastos.findFirst({
      where: { categoria_gasto_id: categoriaId },
    });

    if (gastosAsociados) {
      return NextResponse.json(
        {
          success: false,
          message: "No se puede eliminar la categoría, tiene gastos asociados",
        },
        { status: 400 }
      );
    }

    // Eliminar la categoría de gasto
    await prisma.categoriasGastos.delete({
      where: { categoria_gasto_id: categoriaId },
    });

    return NextResponse.json(
      { success: true, message: "Categoría de gasto eliminada" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/categorias-gastos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando la categoría de gasto" },
      { status: 500 }
    );
  }
}
