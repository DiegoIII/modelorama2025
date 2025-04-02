import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

/**
 * Obtener un item específico del inventario (GET)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inventoryId = Number(params.id);

    if (isNaN(inventoryId)) {
      return NextResponse.json(
        { success: false, message: "ID de inventario inválido" },
        { status: 400 }
      );
    }

    const inventoryItem = await prisma.inventario.findUnique({
      where: { inventario_id: inventoryId },
      include: {
        producto: {
          select: {
            producto_id: true,
            nombre: true,
            descripcion: true,
            precio_venta: true,
          },
        },
      },
    });

    if (!inventoryItem) {
      return NextResponse.json(
        { success: false, message: "Registro de inventario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: inventoryItem },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en GET /api/inventario/[id]:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener el registro de inventario",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Actualizar un item del inventario (PATCH)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inventoryId = Number(params.id);
    const body = await req.json();

    if (isNaN(inventoryId)) {
      return NextResponse.json(
        { success: false, message: "ID de inventario inválido" },
        { status: 400 }
      );
    }

    // Validar campos
    if (body.cantidad !== undefined && isNaN(Number(body.cantidad))) {
      return NextResponse.json(
        { success: false, message: "Cantidad inválida" },
        { status: 400 }
      );
    }

    const existingRecord = await prisma.inventario.findUnique({
      where: { inventario_id: inventoryId },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { success: false, message: "Registro de inventario no encontrado" },
        { status: 404 }
      );
    }

    const updatedRecord = await prisma.inventario.update({
      where: { inventario_id: inventoryId },
      data: {
        cantidad:
          body.cantidad !== undefined ? Number(body.cantidad) : undefined,
        fecha_actualizacion: new Date(),
      },
      include: {
        producto: {
          select: {
            producto_id: true,
            nombre: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Inventario actualizado exitosamente",
        data: updatedRecord,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en PATCH /api/inventario/[id]:", error.message);

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Registro de inventario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error al actualizar el inventario",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Eliminar un item del inventario (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inventoryId = Number(params.id);

    if (isNaN(inventoryId)) {
      return NextResponse.json(
        { success: false, message: "ID de inventario inválido" },
        { status: 400 }
      );
    }

    // Verificar existencia antes de eliminar
    const existingRecord = await prisma.inventario.findUnique({
      where: { inventario_id: inventoryId },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { success: false, message: "Registro de inventario no encontrado" },
        { status: 404 }
      );
    }

    await prisma.inventario.delete({
      where: { inventario_id: inventoryId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registro de inventario eliminado exitosamente",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en DELETE /api/inventario/[id]:", error.message);

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          message: "No se puede eliminar, existen registros relacionados",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error al eliminar el registro de inventario",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
