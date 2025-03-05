import { DetalleVenta } from "app/entities/DetalleVenta";
import { AppDataSource } from "app/lib/data-source";
import { NextRequest, NextResponse } from "next/server";

// 🟢 Obtener todos los detalles de venta (GET /api/detalle-venta)
export async function GET() {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const detalleVentaRepo = AppDataSource.getRepository(DetalleVenta);
    const detalles = await detalleVentaRepo.find({
      relations: ["venta", "producto"],
    });

    return NextResponse.json(detalles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo los detalles de venta" },
      { status: 500 }
    );
  }
}

// 🔵 Crear un nuevo detalle de venta (POST /api/detalle-venta)
export async function POST(req: NextRequest) {
  try {
    const { venta, producto, cantidad, precio_unitario, subtotal } =
      await req.json();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const detalleVentaRepo = AppDataSource.getRepository(DetalleVenta);

    const nuevoDetalle = detalleVentaRepo.create({
      venta,
      producto,
      cantidad,
      precio_unitario,
      subtotal,
    });

    await detalleVentaRepo.save(nuevoDetalle);
    return NextResponse.json(nuevoDetalle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creando el detalle de venta" },
      { status: 500 }
    );
  }
}

// 🟠 Actualizar un detalle de venta por ID (PUT /api/detalle-venta/:id)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { cantidad, precio_unitario, subtotal } = await req.json();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const detalleVentaRepo = AppDataSource.getRepository(DetalleVenta);

    const detalle = await detalleVentaRepo.findOneBy({ detalle_venta_id: id });
    if (!detalle)
      return NextResponse.json(
        { error: "Detalle de venta no encontrado" },
        { status: 404 }
      );

    detalle.cantidad = cantidad;
    detalle.precio_unitario = precio_unitario;
    detalle.subtotal = subtotal;
    await detalleVentaRepo.save(detalle);

    return NextResponse.json(detalle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error actualizando el detalle de venta" },
      { status: 500 }
    );
  }
}

// 🔴 Eliminar un detalle de venta por ID (DELETE /api/detalle-venta/:id)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const detalleVentaRepo = AppDataSource.getRepository(DetalleVenta);

    const detalle = await detalleVentaRepo.findOneBy({ detalle_venta_id: id });
    if (!detalle)
      return NextResponse.json(
        { error: "Detalle de venta no encontrado" },
        { status: 404 }
      );

    await detalleVentaRepo.remove(detalle);
    return NextResponse.json(
      { message: "Detalle de venta eliminado" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error eliminando el detalle de venta" },
      { status: 500 }
    );
  }
}
