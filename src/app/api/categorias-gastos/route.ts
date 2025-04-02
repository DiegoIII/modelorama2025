import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todas las categorías de gastos (GET)
 */
export async function GET() {
  try {
    const categoriasGastos = await prisma.categoriasGastos.findMany({
      select: {
        categoria_gasto_id: true,
        nombre_categoria_gasto: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: categoriasGastos,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en GET /api/categorias-gastos:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Error obteniendo las categorías de gastos",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Crear una nueva categoría de gasto (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Cuerpo de la solicitud inválido" },
        { status: 400 }
      );
    }

    const { nombre_categoria_gasto } = body;

    if (!nombre_categoria_gasto || typeof nombre_categoria_gasto !== "string") {
      return NextResponse.json(
        {
          success: false,
          message:
            "El nombre de la categoría de gasto es obligatorio y debe ser una cadena de texto",
        },
        { status: 400 }
      );
    }

    const nuevaCategoria = await prisma.categoriasGastos.create({
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
        message: "Categoría creada exitosamente",
        data: nuevaCategoria,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error en POST /api/categorias-gastos:", error.message);

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
        message: "Error creando la categoría de gasto",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
