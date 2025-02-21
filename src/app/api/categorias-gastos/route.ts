import { CategoriasGastos } from "app/entities/CategoriasGastos";
import { AppDataSource } from "app/lib/data-source";
import { NextRequest, NextResponse } from "next/server";

// Inicializar la conexión a la base de datos
if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
}

const categoriasGastosRepo = AppDataSource.getRepository(CategoriasGastos);

/**
 * Obtener todas las categorías de gastos (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todas las categorías de gastos...");

    const categoriasGastos = await categoriasGastosRepo.find();
    console.log("Categorías encontradas:", categoriasGastos);

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
 * Crear una nueva categoría de gastos (POST)
 */
export async function POST(req: NextRequest) {
  try {
    console.log("Iniciando creación de categoría de gastos...");

    // Obtener datos del body
    const body = await req.json();
    console.log("Datos recibidos:", body);

    const { nombre_categoria_gasto } = body;

    // Validar que se proporcionó el nombre de la categoría
    if (!nombre_categoria_gasto) {
      console.error("Error: El nombre de la categoría es requerido");
      return NextResponse.json(
        { success: false, message: "El nombre de la categoría es requerido" },
        { status: 400 }
      );
    }

    // Crear una nueva categoría de gastos
    const nuevaCategoriaGasto = categoriasGastosRepo.create({
      nombre_categoria_gasto,
    });
    console.log("Nueva categoría creada:", nuevaCategoriaGasto);

    // Guardar la nueva categoría en la base de datos
    const categoriaGastoGuardada = await categoriasGastosRepo.save(
      nuevaCategoriaGasto
    );
    console.log(
      "Categoría guardada en la base de datos:",
      categoriaGastoGuardada
    );

    return NextResponse.json({
      success: true,
      data: categoriaGastoGuardada,
    });
  } catch (error) {
    console.error("Error en POST /api/categorias-gastos:", error);
    return NextResponse.json(
      { success: false, message: "Error creando la categoría de gastos" },
      { status: 500 }
    );
  }
}
