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

    if (!nombre_categoria_gasto || typeof nombre_categoria_gasto !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Debe proporcionar un nombre válido para actualizar",
        },
        { status: 400 }
      );
    }

    const categoriaActualizada = await prisma.categoriasGastos.update({
      where: { categoria_gasto_id: categoriaId },
      data: {
        nombre_categoria_gasto: nombre_categoria_gasto.trim(),
      },
      select: {
        categoria_gasto_id: true,
        nombre_categoria_gasto: true,
        created_at: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Categoría actualizada exitosamente",
        data: categoriaActualizada,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en PATCH /api/categorias-gastos/[id]:", error.message);

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Categoría de gasto no encontrada" },
        { status: 404 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "El nombre de la categoría ya existe",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error actualizando la categoría de gasto",
        error: error.message,
      },
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

    await prisma.categoriasGastos.delete({
      where: { categoria_gasto_id: categoriaId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Categoría de gasto eliminada exitosamente",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Error en DELETE /api/categorias-gastos/[id]:",
      error.message
    );

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Categoría de gasto no encontrada" },
        { status: 404 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          message: "No se puede eliminar la categoría, tiene gastos asociados",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error eliminando la categoría de gasto",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
