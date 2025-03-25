import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todos los proveedores (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todos los proveedores...");

    const proveedores = await prisma.proveedores.findMany();

    return NextResponse.json(proveedores, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/proveedores:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo los proveedores" },
      { status: 500 }
    );
  }
}

/**
 * Crear un nuevo proveedor (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre_proveedor, contacto, telefono, email } = body;

    if (!nombre_proveedor) {
      return NextResponse.json(
        {
          success: false,
          message: "El nombre del proveedor es obligatorio",
        },
        { status: 400 }
      );
    }

    const nuevoProveedor = await prisma.proveedores.create({
      data: {
        nombre_proveedor,
        contacto,
        telefono,
        email,
      },
    });

    return NextResponse.json(
      { success: true, data: nuevoProveedor },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/proveedores:", error);
    return NextResponse.json(
      { success: false, message: "Error creando el proveedor" },
      { status: 500 }
    );
  }
}
