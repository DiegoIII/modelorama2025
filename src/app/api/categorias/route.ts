import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todas las categorías (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todas las categorías...");

    const categorias = await prisma.categorias.findMany();

    return NextResponse.json(categorias, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/categorias:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo las categorías" },
      { status: 500 }
    );
  }
}

/**
 * Crear una nueva categoría (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre_categoria } = body;

    if (!nombre_categoria) {
      return NextResponse.json(
        {
          success: false,
          message: "El nombre de la categoría es obligatorio",
        },
        { status: 400 }
      );
    }

    const nuevaCategoria = await prisma.categorias.create({
      data: {
        nombre_categoria,
      },
    });

    return NextResponse.json(
      { success: true, data: nuevaCategoria },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/categorias:", error);
    return NextResponse.json(
      { success: false, message: "Error creando la categoría" },
      { status: 500 }
    );
  }
}
