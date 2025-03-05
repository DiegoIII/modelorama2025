import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todos los gastos (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todos los gastos...");

    const gastos = await prisma.gastos.findMany({
      include: {
        categoriaGasto: true,
      },
    });

    return NextResponse.json(gastos, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/gastos:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo los gastos" },
      { status: 500 }
    );
  }
}

/**
 * Crear un nuevo gasto (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { descripcion, monto, categoria_gasto_id } = body;

    if (!descripcion || !monto || !categoria_gasto_id) {
      return NextResponse.json(
        { success: false, message: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const nuevoGasto = await prisma.gastos.create({
      data: {
        descripcion,
        monto,
        categoria_gasto_id,
      },
    });

    return NextResponse.json(
      { success: true, data: nuevoGasto },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/gastos:", error);
    return NextResponse.json(
      { success: false, message: "Error creando el gasto" },
      { status: 500 }
    );
  }
}
