import { Inventario } from "app/entities/Inventario";
import { AppDataSource } from "app/lib/data-source";
import { NextRequest, NextResponse } from "next/server";
import { Productos } from "app/entities/Productos"; // Importar la entidad Productos

// Inicializar la conexión a la base de datos
if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
}

const inventarioRepo = AppDataSource.getRepository(Inventario);
const productoRepo = AppDataSource.getRepository(Productos); // Repositorio para Productos

/**
 * Actualizar un inventario por ID (PUT)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar que el ID sea un número válido
    const inventarioId = Number(params.id);
    if (isNaN(inventarioId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Buscar el registro de inventario en la base de datos
    const inventario = await inventarioRepo.findOneBy({
      inventario_id: inventarioId,
    });

    if (!inventario) {
      return NextResponse.json(
        { success: false, message: "Inventario no encontrado" },
        { status: 404 }
      );
    }

    // Obtener datos del body
    const body = await req.json();
    const { producto_id, cantidad } = body;

    // Buscar el producto en la base de datos
    const producto = await productoRepo.findOneBy({ producto_id });
    if (!producto) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar solo los campos proporcionados
    inventarioRepo.merge(inventario, {
      producto, // Mantiene la relación con el producto
      cantidad,
      fecha_actualizacion: new Date(), // Actualiza la fecha de modificación
    });

    const inventarioActualizado = await inventarioRepo.save(inventario);

    return NextResponse.json({ success: true, data: inventarioActualizado });
  } catch (error) {
    console.error("Error en PUT /api/inventario/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando inventario" },
      { status: 500 }
    );
  }
}
