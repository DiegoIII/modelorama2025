import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "app/lib/data-source";
import { CategoriasGastos } from "app/entities/CategoriasGastos";

// 🟢 Obtener todas las categorías de gastos (GET /api/categorias-gastos)
export async function GET() {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const categoriasGastosRepo = AppDataSource.getRepository(CategoriasGastos);
    const categoriasGastos = await categoriasGastosRepo.find();

    return NextResponse.json(categoriasGastos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo las categorías de gastos" },
      { status: 500 }
    );
  }
}

// 🔵 Crear una nueva categoría de gastos (POST /api/categorias-gastos)
export async function POST(req: NextRequest) {
  try {
    const { nombre_categoria_gasto } = await req.json();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const categoriasGastosRepo = AppDataSource.getRepository(CategoriasGastos);

    const nuevaCategoriaGasto = categoriasGastosRepo.create({
      nombre_categoria_gasto,
    });

    await categoriasGastosRepo.save(nuevaCategoriaGasto);
    return NextResponse.json(nuevaCategoriaGasto, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creando la categoría de gastos" },
      { status: 500 }
    );
  }
}
