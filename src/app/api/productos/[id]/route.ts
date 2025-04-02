import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

/**
 * Obtener un producto específico (GET)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productoId = parseInt(params.id);

    if (isNaN(productoId)) {
      return NextResponse.json(
        { success: false, message: "ID de producto inválido" },
        { status: 400 }
      );
    }

    const producto = await prisma.productos.findUnique({
      where: { producto_id: productoId },
      include: {
        categoria: {
          select: {
            categoria_id: true,
            nombre_categoria: true,
          },
        },
        proveedor: {
          select: {
            proveedor_id: true,
            nombre_proveedor: true,
          },
        },
      },
    });

    if (!producto) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: producto,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en GET /api/productos/[id]:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener el producto",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Actualizar un producto (PATCH)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productoId = parseInt(params.id);
    const body = await req.json();

    if (isNaN(productoId)) {
      return NextResponse.json(
        { success: false, message: "ID de producto inválido" },
        { status: 400 }
      );
    }

    // Validaciones básicas
    if (!body.nombre || !body.precio_venta) {
      return NextResponse.json(
        {
          success: false,
          message: "Nombre y precio de venta son campos requeridos",
        },
        { status: 400 }
      );
    }

    if (isNaN(parseFloat(body.precio_venta))) {
      return NextResponse.json(
        {
          success: false,
          message: "Precio de venta debe ser un número válido",
        },
        { status: 400 }
      );
    }

    const productoExiste = await prisma.productos.findUnique({
      where: { producto_id: productoId },
    });

    if (!productoExiste) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const productoActualizado = await prisma.productos.update({
      where: { producto_id: productoId },
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        precio_compra: body.precio_compra
          ? parseFloat(body.precio_compra)
          : undefined,
        precio_venta: parseFloat(body.precio_venta),
        categoria_id: body.categoria_id
          ? parseInt(body.categoria_id)
          : undefined,
        proveedor_id: body.proveedor_id
          ? parseInt(body.proveedor_id)
          : undefined,
        stock_minimo: body.stock_minimo
          ? parseInt(body.stock_minimo)
          : undefined,
        stock_maximo: body.stock_maximo
          ? parseInt(body.stock_maximo)
          : undefined,
      },
      include: {
        categoria: {
          select: {
            nombre_categoria: true,
          },
        },
        proveedor: {
          select: {
            nombre_proveedor: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Producto actualizado exitosamente",
        data: productoActualizado,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en PATCH /api/productos/[id]:", error.message);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "Ya existe un producto con este nombre",
        },
        { status: 400 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          message: "La categoría o proveedor especificado no existe",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error al actualizar el producto",
        error: error.message,
      },
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
        { success: false, message: "ID de producto inválido" },
        { status: 400 }
      );
    }

    // Verificar si hay registros de inventario asociados
    const inventarioAsociado = await prisma.inventario.findFirst({
      where: { producto_id: productoId },
    });

    if (inventarioAsociado) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No se puede eliminar, el producto tiene registros de inventario asociados",
        },
        { status: 400 }
      );
    }

    // Verificar si hay detalles de venta asociados
    const ventasAsociadas = await prisma.detalleVentas.findFirst({
      where: { producto_id: productoId },
    });

    if (ventasAsociadas) {
      return NextResponse.json(
        {
          success: false,
          message: "No se puede eliminar, el producto tiene ventas asociadas",
        },
        { status: 400 }
      );
    }

    await prisma.productos.delete({
      where: { producto_id: productoId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Producto eliminado exitosamente",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en DELETE /api/productos/[id]:", error.message);

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error al eliminar el producto",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
