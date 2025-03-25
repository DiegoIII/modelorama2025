import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtener todos los productos (GET)
 */
export async function GET() {
  try {
    console.log("Obteniendo todos los productos...");

    const productos = await prisma.productos.findMany();

    return NextResponse.json(productos, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/productos:", error);
    return NextResponse.json(
      { success: false, message: "Error obteniendo los productos" },
      { status: 500 }
    );
  }
}

/**
 * Crear un nuevo producto (POST)
 */
export async function POST(req: NextRequest) {
  try {
    // Asegúrate de que el cuerpo sea recibido correctamente como JSON
    const body = await req.json();
    console.log("Cuerpo recibido:", body); // Verificar que el cuerpo es correcto

    // Desestructurar los campos del cuerpo de la solicitud
    const {
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      categoria_id,
      proveedor_id,
      stock_minimo,
      stock_maximo,
    } = body;

    // Validar que todos los campos obligatorios estén presentes
    if (
      !nombre ||
      !precio_compra ||
      !precio_venta ||
      !categoria_id ||
      !proveedor_id ||
      !stock_minimo ||
      !stock_maximo
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Todos los campos obligatorios deben ser proporcionados",
        },
        { status: 400 }
      );
    }

    // Validación adicional: verificar que los campos numéricos sean positivos
    if (
      precio_compra <= 0 ||
      precio_venta <= 0 ||
      stock_minimo < 0 ||
      stock_maximo < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Los valores de precio y stock deben ser positivos",
        },
        { status: 400 }
      );
    }

    // Crear el nuevo producto en la base de datos
    const nuevoProducto = await prisma.productos.create({
      data: {
        nombre,
        descripcion,
        precio_compra,
        precio_venta,
        categoria_id,
        proveedor_id,
        stock_minimo,
        stock_maximo,
      },
    });

    return NextResponse.json(
      { success: true, data: nuevoProducto },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/productos:", error);
    return NextResponse.json(
      { success: false, message: "Error creando el producto" },
      { status: 500 }
    );
  }
}
