import { Inventario } from "app/entities/Inventario";
import { AppDataSource } from "app/lib/data-source";
import { NextRequest, NextResponse } from "next/server";

// 🟢 Obtener todo el inventario (GET /api/inventario)
export async function GET() {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const inventarioRepo = AppDataSource.getRepository(Inventario);
    const inventario = await inventarioRepo.find({ relations: ["producto"] });

    return NextResponse.json(inventario, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo el inventario" },
      { status: 500 }
    );
  }
}

// 🔵 Agregar un nuevo registro al inventario (POST /api/inventario)
export async function POST(req: NextRequest) {
  try {
    const { producto, cantidad } = await req.json();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const inventarioRepo = AppDataSource.getRepository(Inventario);

    const nuevoInventario = inventarioRepo.create({
      producto,
      cantidad,
    });

    await inventarioRepo.save(nuevoInventario);
    return NextResponse.json(nuevoInventario, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error agregando al inventario" },
      { status: 500 }
    );
  }
}

// 🟠 Actualizar un registro de inventario por ID (PUT /api/inventario/:id)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { cantidad } = await req.json();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const inventarioRepo = AppDataSource.getRepository(Inventario);

    const inventario = await inventarioRepo.findOneBy({ inventario_id: id });
    if (!inventario)
      return NextResponse.json(
        { error: "Registro de inventario no encontrado" },
        { status: 404 }
      );

    inventario.cantidad = cantidad;
    await inventarioRepo.save(inventario);

    return NextResponse.json(inventario, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error actualizando el inventario" },
      { status: 500 }
    );
  }
}

// 🔴 Eliminar un registro de inventario por ID (DELETE /api/inventario/:id)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const inventarioRepo = AppDataSource.getRepository(Inventario);

    const inventario = await inventarioRepo.findOneBy({ inventario_id: id });
    if (!inventario)
      return NextResponse.json(
        { error: "Registro de inventario no encontrado" },
        { status: 404 }
      );

    await inventarioRepo.remove(inventario);
    return NextResponse.json(
      { message: "Registro de inventario eliminado" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error eliminando el inventario" },
      { status: 500 }
    );
  }
}
