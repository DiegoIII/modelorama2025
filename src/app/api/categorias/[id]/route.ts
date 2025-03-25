import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Actualizar una categoría (PATCH)
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
    const { nombre_categoria } = body;

    if (!nombre_categoria) {
      return NextResponse.json(
        {
          success: false,
          message: "Debe proporcionar un nombre para actualizar",
        },
        { status: 400 }
      );
    }

    // Verificar si la categoría existe
    const categoriaExiste = await prisma.categorias.findUnique({
      where: { categoria_id: categoriaId },
    });

    if (!categoriaExiste) {
      return NextResponse.json(
        { success: false, message: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar la categoría
    const categoriaActualizada = await prisma.categorias.update({
      where: { categoria_id: categoriaId },
      data: {
        nombre_categoria,
      },
    });

    return NextResponse.json(
      { success: true, data: categoriaActualizada },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/categorias/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando la categoría" },
      { status: 500 }
    );
  }
}

/**
 * Eliminar una categoría (DELETE)
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

    // Verificar si la categoría existe antes de eliminarla
    const categoriaExiste = await prisma.categorias.findUnique({
      where: { categoria_id: categoriaId },
    });

    if (!categoriaExiste) {
      return NextResponse.json(
        { success: false, message: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    // Verificar si hay productos asociados a la categoría
    const productosAsociados = await prisma.productos.findFirst({
      where: { categoria_id: categoriaId },
    });

    if (productosAsociados) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No se puede eliminar la categoría, tiene productos asociados",
        },
        { status: 400 }
      );
    }

    // Eliminar la categoría
    await prisma.categorias.delete({
      where: { categoria_id: categoriaId },
    });

    return NextResponse.json(
      { success: true, message: "Categoría eliminada" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/categorias/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando la categoría" },
      { status: 500 }
    );
  }
}
