import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

/**
 * Obtener todos los registros de inventario (GET)
 */
export async function GET() {
  try {
    const inventario = await prisma.inventario.findMany({
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
      orderBy: {
        fecha_actualizacion: "desc",
      },
    });

    return NextResponse.json(
      { success: true, data: inventario },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en GET /api/inventario:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener el inventario",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Crear un nuevo registro de inventario (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { producto_id, cantidad } = body;

    // Validar campos requeridos
    if (!producto_id || cantidad === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "producto_id y cantidad son campos requeridos",
        },
        { status: 400 }
      );
    }

    // Validar tipos de datos
    if (isNaN(Number(producto_id)) || isNaN(Number(cantidad))) {
      return NextResponse.json(
        {
          success: false,
          message: "producto_id y cantidad deben ser números válidos",
        },
        { status: 400 }
      );
    }

    // Verificar si el producto existe
    const productoExiste = await prisma.productos.findUnique({
      where: { producto_id: Number(producto_id) },
    });

    if (!productoExiste) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si ya existe un registro para este producto
    const registroExistente = await prisma.inventario.findFirst({
      where: { producto_id: Number(producto_id) },
    });

    if (registroExistente) {
      return NextResponse.json(
        {
          success: false,
          message: "Ya existe un registro de inventario para este producto",
        },
        { status: 400 }
      );
    }

    // Crear el registro de inventario
    const nuevoRegistro = await prisma.inventario.create({
      data: {
        producto_id: Number(producto_id),
        cantidad: Number(cantidad),
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
        message: "Registro de inventario creado exitosamente",
        data: nuevoRegistro,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error en POST /api/inventario:", error.message);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "Ya existe un registro para este producto",
        },
        { status: 400 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          message: "El producto especificado no existe",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error al crear el registro de inventario",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
