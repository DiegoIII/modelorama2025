import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todas las categorías de gastos (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todas las categorías de gastos...");

    const categoriasGastos = await prisma.categoriasGastos.findMany();

    return NextResponse.json(categoriasGastos, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/categorias-gastos:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo las categorías de gastos" },
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
    const { nombre_categoria_gasto } = body;

    if (!nombre_categoria_gasto) {
      return NextResponse.json(
        {
          success: false,
          message: "El nombre de la categoría de gasto es obligatorio",
        },
        { status: 400 }
      );
    }

    const nuevaCategoria = await prisma.categoriasGastos.create({
      data: {
        nombre_categoria_gasto,
      },
    });

    return NextResponse.json(
      { success: true, data: nuevaCategoria },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/categorias-gastos:", error);
    return NextResponse.json(
      { success: false, message: "Error creando la categoría de gasto" },
      { status: 500 }
    );
  }
}
