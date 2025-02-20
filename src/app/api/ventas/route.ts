import { Ventas } from "app/entities/Ventas";
import { AppDataSource } from "app/lib/data-source";
import { NextRequest, NextResponse } from "next/server";

// 🟢 Obtener todas las ventas (GET /api/ventas)
export async function GET() {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const ventasRepo = AppDataSource.getRepository(Ventas);
    const ventas = await ventasRepo.find({ relations: ["detalles"] });

    return NextResponse.json(ventas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo las ventas" },
      { status: 500 }
    );
  }
}

// 🔵 Crear una nueva venta (POST /api/ventas)
export async function POST(req: NextRequest) {
  try {
    const { total_venta, detalles } = await req.json();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const ventasRepo = AppDataSource.getRepository(Ventas);

    const nuevaVenta = ventasRepo.create({
      total_venta,
      detalles,
    });

    await ventasRepo.save(nuevaVenta);
    return NextResponse.json(nuevaVenta, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creando la venta" },
      { status: 500 }
    );
  }
}

// 🟠 Actualizar una venta por ID (PUT /api/ventas/:id)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { total_venta } = await req.json();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const ventasRepo = AppDataSource.getRepository(Ventas);

    const venta = await ventasRepo.findOneBy({ venta_id: id });
    if (!venta)
      return NextResponse.json(
        { error: "Venta no encontrada" },
        { status: 404 }
      );

    venta.total_venta = total_venta;
    await ventasRepo.save(venta);

    return NextResponse.json(venta, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error actualizando la venta" },
      { status: 500 }
    );
  }
}

// 🔴 Eliminar una venta por ID (DELETE /api/ventas/:id)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const ventasRepo = AppDataSource.getRepository(Ventas);

    const venta = await ventasRepo.findOneBy({ venta_id: id });
    if (!venta)
      return NextResponse.json(
        { error: "Venta no encontrada" },
        { status: 404 }
      );

    await ventasRepo.remove(venta);
    return NextResponse.json({ message: "Venta eliminada" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error eliminando la venta" },
      { status: 500 }
    );
  }
}
