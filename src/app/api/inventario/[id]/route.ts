import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Actualizar un inventario (PATCH)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inventarioId = parseInt(params.id);

    if (isNaN(inventarioId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { producto_id, cantidad } = body;

    if (!producto_id || !cantidad) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Debe proporcionar un producto_id y cantidad para actualizar",
        },
        { status: 400 }
      );
    }

    // Verificar si el inventario existe
    const inventarioExiste = await prisma.inventario.findUnique({
      where: { inventario_id: inventarioId },
    });

    if (!inventarioExiste) {
      return NextResponse.json(
        { success: false, message: "Inventario no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar el inventario
    const inventarioActualizado = await prisma.inventario.update({
      where: { inventario_id: inventarioId },
      data: {
        producto_id,
        cantidad,
      },
    });

    return NextResponse.json(
      { success: true, data: inventarioActualizado },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/inventario/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando el inventario" },
      { status: 500 }
    );
  }
}

/**
 * Eliminar un inventario (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inventarioId = parseInt(params.id);

    if (isNaN(inventarioId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Verificar si el inventario existe antes de eliminarlo
    const inventarioExiste = await prisma.inventario.findUnique({
      where: { inventario_id: inventarioId },
    });

    if (!inventarioExiste) {
      return NextResponse.json(
        { success: false, message: "Inventario no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el inventario
    await prisma.inventario.delete({
      where: { inventario_id: inventarioId },
    });

    return NextResponse.json(
      { success: true, message: "Inventario eliminado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/inventarios/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando el inventario" },
      { status: 500 }
    );
  }
}
