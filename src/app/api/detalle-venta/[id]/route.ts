import { DetalleVenta } from "app/entities/DetalleVenta";
import { AppDataSource } from "app/lib/data-source";
import { NextRequest, NextResponse } from "next/server";
import { Ventas } from "app/entities/Ventas"; // Importar la entidad Ventas
import { Productos } from "app/entities/Productos"; // Importar la entidad Productos

// Inicializar la conexión a la base de datos
if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
}

const detalleVentaRepo = AppDataSource.getRepository(DetalleVenta);
const ventasRepo = AppDataSource.getRepository(Ventas);
const productosRepo = AppDataSource.getRepository(Productos);

/**
 * Actualizar un detalle de venta por ID (PUT)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar que el ID sea un número válido
    const detalleVentaId = Number(params.id);
    if (isNaN(detalleVentaId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Buscar el detalle de venta en la base de datos
    const detalleVenta = await detalleVentaRepo.findOneBy({
      detalle_venta_id: detalleVentaId,
    });

    if (!detalleVenta) {
      return NextResponse.json(
        { success: false, message: "Detalle de venta no encontrado" },
        { status: 404 }
      );
    }

    // Obtener datos del body
    const body = await req.json();
    const { venta_id, producto_id, cantidad, precio_unitario, subtotal } = body;

    // Buscar la venta en la base de datos
    const venta = await ventasRepo.findOneBy({ venta_id });
    if (!venta) {
      return NextResponse.json(
        { success: false, message: "Venta no encontrada" },
        { status: 404 }
      );
    }

    // Buscar el producto en la base de datos
    const producto = await productosRepo.findOneBy({ producto_id });
    if (!producto) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar solo los campos proporcionados
    detalleVentaRepo.merge(detalleVenta, {
      venta, // Actualizar la relación completa
      producto, // Actualizar la relación completa
      cantidad,
      precio_unitario,
      subtotal,
    });

    const detalleVentaActualizado = await detalleVentaRepo.save(detalleVenta);

    return NextResponse.json({ success: true, data: detalleVentaActualizado });
  } catch (error) {
    console.error("Error en PUT /api/detalle-venta/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando detalle de venta" },
      { status: 500 }
    );
  }
}
