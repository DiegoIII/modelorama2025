import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Actualizar un producto (PATCH)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productoId = parseInt(params.id);

    if (isNaN(productoId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      categoria_id,
      proveedor_id,
      stock_minimo,
      stock_maximo,
    } = body;

    if (
      !nombre ||
      !precio_compra ||
      !precio_venta ||
      !categoria_id ||
      !proveedor_id ||
      !stock_minimo ||
      !stock_maximo
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Todos los campos obligatorios deben ser proporcionados para actualizar",
        },
        { status: 400 }
      );
    }

    // Verificar si el producto existe
    const productoExiste = await prisma.productos.findUnique({
      where: { producto_id: productoId },
    });

    if (!productoExiste) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar el producto
    const productoActualizado = await prisma.productos.update({
      where: { producto_id: productoId },
      data: {
        nombre,
        descripcion,
        precio_compra,
        precio_venta,
        categoria_id,
        proveedor_id,
        stock_minimo,
        stock_maximo,
      },
    });

    return NextResponse.json(
      { success: true, data: productoActualizado },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/productos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando el producto" },
      { status: 500 }
    );
  }
}

/**
 * Eliminar un producto (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productoId = parseInt(params.id);

    if (isNaN(productoId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Verificar si el producto existe antes de eliminarlo
    const productoExiste = await prisma.productos.findUnique({
      where: { producto_id: productoId },
    });

    if (!productoExiste) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el producto
    await prisma.productos.delete({
      where: { producto_id: productoId },
    });

    return NextResponse.json(
      { success: true, message: "Producto eliminado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/productos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando el producto" },
      { status: 500 }
    );
  }
}
