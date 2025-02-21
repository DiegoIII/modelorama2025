import { Gastos } from "app/entities/Gastos";
import { CategoriasGastos } from "app/entities/CategoriasGastos";
import { AppDataSource } from "app/lib/data-source";
import { NextRequest, NextResponse } from "next/server";

// Inicializar la conexión a la base de datos
if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
}

const gastosRepo = AppDataSource.getRepository(Gastos);
const categoriasGastosRepo = AppDataSource.getRepository(CategoriasGastos);

/**
 * Obtener todos los gastos (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todos los gastos...");

    const gastos = await gastosRepo.find({ relations: ["categoriaGasto"] });
    console.log("Gastos encontrados:", gastos);

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
    console.log("Iniciando creación de gasto...");

    // Obtener datos del body
    const body = await req.json();
    console.log("Datos recibidos:", body);

    const { description, monto, categoria_gasto_id } = body;

    // Validar que se proporcionaron todos los campos requeridos
    if (!description || !monto || !categoria_gasto_id) {
      console.error("Error: Faltan campos requeridos");
      return NextResponse.json(
        { success: false, message: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Buscar la categoría de gastos en la base de datos
    const categoriaGasto = await categoriasGastosRepo.findOneBy({
      categoria_gasto_id: categoria_gasto_id,
    });

    if (!categoriaGasto) {
      return NextResponse.json(
        { success: false, message: "Categoría de gastos no encontrada" },
        { status: 404 }
      );
    }

    // Crear un nuevo gasto
    const nuevoGasto = gastosRepo.create({
      description,
      monto,
      categoriaGasto,
    });
    console.log("Nuevo gasto creado:", nuevoGasto);

    // Guardar el nuevo gasto en la base de datos
    const gastoGuardado = await gastosRepo.save(nuevoGasto);
    console.log("Gasto guardado en la base de datos:", gastoGuardado);

    return NextResponse.json({
      success: true,
      data: gastoGuardado,
    });
  } catch (error) {
    console.error("Error en POST /api/gastos:", error);
    return NextResponse.json(
      { success: false, message: "Error creando el gasto" },
      { status: 500 }
    );
  }
}
