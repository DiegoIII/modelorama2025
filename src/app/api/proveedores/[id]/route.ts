import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Actualizar un proveedor (PATCH)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proveedorId = parseInt(params.id);

    if (isNaN(proveedorId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { nombre_proveedor, contacto, telefono, email } = body;

    if (!nombre_proveedor) {
      return NextResponse.json(
        {
          success: false,
          message: "Debe proporcionar un nombre para actualizar",
        },
        { status: 400 }
      );
    }

    // Verificar si el proveedor existe
    const proveedorExiste = await prisma.proveedores.findUnique({
      where: { proveedor_id: proveedorId },
    });

    if (!proveedorExiste) {
      return NextResponse.json(
        { success: false, message: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar el proveedor
    const proveedorActualizado = await prisma.proveedores.update({
      where: { proveedor_id: proveedorId },
      data: {
        nombre_proveedor,
        contacto,
        telefono,
        email,
      },
    });

    return NextResponse.json(
      { success: true, data: proveedorActualizado },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/proveedores/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando el proveedor" },
      { status: 500 }
    );
  }
}

/**
 * Eliminar un proveedor (DELETE)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proveedorId = parseInt(params.id);

    if (isNaN(proveedorId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Verificar si el proveedor existe antes de eliminarlo
    const proveedorExiste = await prisma.proveedores.findUnique({
      where: { proveedor_id: proveedorId },
    });

    if (!proveedorExiste) {
      return NextResponse.json(
        { success: false, message: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si hay productos o compras asociados al proveedor
    const productosAsociados = await prisma.productos.findFirst({
      where: { proveedor_id: proveedorId },
    });

    const comprasAsociadas = await prisma.compras.findFirst({
      where: { proveedor_id: proveedorId },
    });

    if (productosAsociados || comprasAsociadas) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No se puede eliminar el proveedor, tiene productos o compras asociadas",
        },
        { status: 400 }
      );
    }

    // Eliminar el proveedor
    await prisma.proveedores.delete({
      where: { proveedor_id: proveedorId },
    });

    return NextResponse.json(
      { success: true, message: "Proveedor eliminado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/proveedores/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error eliminando el proveedor" },
      { status: 500 }
    );
  }
}
