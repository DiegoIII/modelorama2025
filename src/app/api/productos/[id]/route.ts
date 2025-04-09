import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productoId = parseInt(params.id);

    if (isNaN(productoId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de producto inválido",
          details: `El ID proporcionado (${params.id}) no es un número válido`,
        },
        { status: 400 }
      );
    }

    // Verificar si el producto existe
    const producto = await prisma.productos.findUnique({
      where: { producto_id: productoId },
      include: {
        inventario: true, // Ensure full related data is fetched
        detalleVentas: true, // Ensure full related data is fetched
      },
    });

    if (!producto) {
      return NextResponse.json(
        {
          success: false,
          message: "Producto no encontrado",
          details: `No se encontró un producto con ID ${productoId}`,
        },
        { status: 404 }
      );
    }

    // Verificar registros asociados
    const tieneInventario = !!producto.inventario;
    const tieneVentas = producto.detalleVentas.length > 0;

    if (tieneInventario || tieneVentas) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No se puede eliminar el producto porque tiene registros asociados",
          details: {
            tieneInventario,
            tieneVentas,
            countInventario: producto.inventario ? 1 : 0,
            countVentas: producto.detalleVentas.length,
          },
        },
        { status: 400 }
      );
    }

    // Eliminar el producto
    await prisma.productos.delete({
      where: { producto_id: productoId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Producto eliminado exitosamente",
        deletedProductId: productoId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en DELETE /api/productos/[id]:", error);

    // Manejo de errores específicos de Prisma
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Producto no encontrado",
          errorCode: error.code,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error interno al eliminar el producto",
        error: error.message,
        ...(error.code && { errorCode: error.code }),
      },
      { status: 500 }
    );
  }
}
