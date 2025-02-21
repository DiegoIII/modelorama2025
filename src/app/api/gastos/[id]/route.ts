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
 * Actualizar un gasto por ID (PUT)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Iniciando actualización de gasto...");

    // Validar que el ID sea un número válido
    const gastoId = Number(params.id);
    if (isNaN(gastoId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Buscar el gasto en la base de datos
    const gasto = await gastosRepo.findOneBy({ gasto_id: gastoId });

    if (!gasto) {
      return NextResponse.json(
        { success: false, message: "Gasto no encontrado" },
        { status: 404 }
      );
    }

    // Obtener datos del body
    const { description, monto, categoria_gasto_id } = await req.json();

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

    // Actualizar solo los campos proporcionados
    gasto.description = description;
    gasto.monto = monto;
    gasto.categoriaGasto = categoriaGasto;

    // Guardar los cambios en la base de datos
    const gastoActualizado = await gastosRepo.save(gasto);

    return NextResponse.json({
      success: true,
      data: gastoActualizado,
    });
  } catch (error) {
    console.error("Error en PUT /api/gastos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando el gasto" },
      { status: 500 }
    );
  }
}

/**
 * Eliminar un gasto por ID (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Iniciando eliminación de gasto...");

    // Validar que el ID sea un número válido
    const gastoId = Number(params.id);
    if (isNaN(gastoId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Buscar el gasto en la base de datos
    const gasto = await gastosRepo.findOneBy({ gasto_id: gastoId });

    if (!gasto) {
      return NextResponse.json(
        { success: false, message: "Gasto no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el gasto
    await gastosRepo.remove(gasto);

    return NextResponse.json({
      success: true,
      message: "Gasto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error en DELETE /api/gastos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando el gasto" },
      { status: 500 }
    );
  }
}
