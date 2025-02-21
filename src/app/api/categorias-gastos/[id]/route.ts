import { CategoriasGastos } from "app/entities/CategoriasGastos";
import { AppDataSource } from "app/lib/data-source";
import { NextRequest, NextResponse } from "next/server";

// Inicializar la conexión a la base de datos
if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
}

const categoriasGastosRepo = AppDataSource.getRepository(CategoriasGastos);

/**
 * Actualizar una categoría de gastos por ID (PUT)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Iniciando actualización de categoría de gastos...");

    // Validar que el ID sea un número válido
    const categoriaGastoId = Number(params.id);
    if (isNaN(categoriaGastoId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Buscar la categoría de gastos en la base de datos
    const categoriaGasto = await categoriasGastosRepo.findOneBy({
      categoria_gasto_id: categoriaGastoId,
    });

    if (!categoriaGasto) {
      return NextResponse.json(
        { success: false, message: "Categoría de gastos no encontrada" },
        { status: 404 }
      );
    }

    // Obtener datos del body
    const { nombre_categoria_gasto } = await req.json();

    // Actualizar solo los campos proporcionados
    categoriaGasto.nombre_categoria_gasto = nombre_categoria_gasto;

    // Guardar los cambios en la base de datos
    const categoriaGastoActualizada = await categoriasGastosRepo.save(
      categoriaGasto
    );

    return NextResponse.json({
      success: true,
      data: categoriaGastoActualizada,
    });
  } catch (error) {
    console.error("Error en PUT /api/categorias-gastos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando la categoría de gastos" },
      { status: 500 }
    );
  }
}

/**
 * Eliminar una categoría de gastos por ID (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Iniciando eliminación de categoría de gastos...");

    // Validar que el ID sea un número válido
    const categoriaGastoId = Number(params.id);
    if (isNaN(categoriaGastoId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Buscar la categoría de gastos en la base de datos
    const categoriaGasto = await categoriasGastosRepo.findOneBy({
      categoria_gasto_id: categoriaGastoId,
    });

    if (!categoriaGasto) {
      return NextResponse.json(
        { success: false, message: "Categoría de gastos no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar la categoría de gastos
    await categoriasGastosRepo.remove(categoriaGasto);

    return NextResponse.json({
      success: true,
      message: "Categoría de gastos eliminada correctamente",
    });
  } catch (error) {
    console.error("Error en DELETE /api/categorias-gastos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando la categoría de gastos" },
      { status: 500 }
    );
  }
}
