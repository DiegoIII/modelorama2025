import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Get specific inventory item
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inventoryId = Number(params.id);

    const inventoryItem = await prisma.inventario.findUnique({
      where: { inventario_id: inventoryId },
      include: {
        producto: {
          select: {
            nombre: true,
            descripcion: true,
          },
        },
      },
    });

    if (!inventoryItem) {
      return NextResponse.json(
        { error: "Inventory record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(inventoryItem, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch inventory record" },
      { status: 500 }
    );
  }
}

// PATCH - Update inventory item
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inventoryId = Number(params.id);
    const body = await req.json();

    // Validate ID
    if (isNaN(inventoryId)) {
      return NextResponse.json(
        { error: "Invalid inventory ID" },
        { status: 400 }
      );
    }

    // Check if record exists
    const existingRecord = await prisma.inventario.findUnique({
      where: { inventario_id: inventoryId },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: "Inventory record not found" },
        { status: 404 }
      );
    }

    // Update record
    const updatedRecord = await prisma.inventario.update({
      where: { inventario_id: inventoryId },
      data: {
        cantidad:
          body.cantidad !== undefined ? Number(body.cantidad) : undefined,
        fecha_actualizacion: body.fecha_actualizacion || new Date(),
      },
    });

    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update inventory record" },
      { status: 500 }
    );
  }
}

// DELETE - Remove inventory item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inventoryId = Number(params.id);

    if (isNaN(inventoryId)) {
      return NextResponse.json(
        { error: "Invalid inventory ID" },
        { status: 400 }
      );
    }

    await prisma.inventario.delete({
      where: { inventario_id: inventoryId },
    });

    return NextResponse.json(
      { message: "Inventory record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete inventory record" },
      { status: 500 }
    );
  }
}
