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

    // Validaciones
    if (!compra_id || isNaN(compra_id)) {
      return NextResponse.json(
        { success: false, message: "ID de compra inválido" },
        { status: 400 }
      );
    }

    if (!producto_id || isNaN(producto_id)) {
      return NextResponse.json(
        { success: false, message: "ID de producto inválido" },
        { status: 400 }
      );
    }

    if (!cantidad || isNaN(cantidad)) {
      return NextResponse.json(
        { success: false, message: "Cantidad inválida" },
        { status: 400 }
      );
    }

    if (!precio_unitario || isNaN(precio_unitario)) {
      return NextResponse.json(
        { success: false, message: "Precio unitario inválido" },
        { status: 400 }
      );
    }

    // Actualizar el detalle de compra
    const detalleActualizado = await prisma.detalleCompras.update({
      where: { detalle_compra_id: detalleCompraId },
      data: {
        compra_id: parseInt(compra_id),
        producto_id: parseInt(producto_id),
        cantidad: parseInt(cantidad),
        precio_unitario: parseFloat(precio_unitario),
        subtotal: parseFloat(precio_unitario) * parseInt(cantidad), // Calcular subtotal
      },
      include: {
        compra: {
          select: {
            compra_id: true,
            fecha_compra: true,
          },
        },
        producto: {
          select: {
            producto_id: true,
            nombre: true, // Replace 'nombre_producto' with the correct property name
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Detalle de compra actualizado exitosamente",
        data: detalleActualizado,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en PATCH /api/detalle-compras/[id]:", error.message);

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Detalle de compra no encontrado" },
        { status: 404 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          message: "La compra o producto especificado no existe",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error actualizando el detalle de compra",
        error: error.message,
      },
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

    // Eliminar el detalle de compra
    await prisma.detalleCompras.delete({
      where: { detalle_compra_id: detalleCompraId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Detalle de compra eliminado exitosamente",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en DELETE /api/detalle-compras/[id]:", error.message);

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Detalle de compra no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error eliminando el detalle de compra",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
