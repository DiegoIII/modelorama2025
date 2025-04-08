import prisma from "app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const productos = await prisma.productos.findMany({
      include: {
        categoria: {
          select: {
            // Se asume que el campo correcto es 'nombre_categoria'
            nombre_categoria: true,
          },
        },
        proveedor: {
          select: {
            // Se asume que el campo correcto es 'nombre_proveedor'
            nombre_proveedor: true,
          },
        },
      },
    });

    // Mapear productos para formatear la respuesta.
    // Agregamos valores por defecto para imagenUrl y estado.
    const formattedProducts = productos.map((producto) => ({
      producto_id: producto.producto_id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio_compra: producto.precio_compra,
      precio_venta: producto.precio_venta,
      categoria_id: producto.categoria_id,
      proveedor_id: producto.proveedor_id,
      stock_minimo: producto.stock_minimo,
      stock_maximo: producto.stock_maximo,
      created_at: producto.created_at,
      // Propiedades derivadas:
      categoria: producto.categoria?.nombre_categoria || "Sin categoría",
      proveedor: producto.proveedor?.nombre_proveedor || "Sin proveedor",
      imagenUrl: "/placeholder.png",
      estado: "activo",
    }));

    return NextResponse.json(
      { success: true, data: formattedProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en GET /api/productos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error obteniendo productos",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Datos recibidos:", body);

    // Buscar categoría por nombre
    const categoria = await prisma.categorias.findFirst({
      where: { nombre_categoria: body.categoria },
      select: { categoria_id: true },
    });

    if (!categoria) {
      return NextResponse.json(
        {
          success: false,
          error: `Categoría '${body.categoria}' no encontrada`,
        },
        { status: 404 }
      );
    }

    // Buscar proveedor por nombre
    const proveedor = await prisma.proveedores.findFirst({
      where: { nombre_proveedor: body.proveedor },
    });

    if (!proveedor) {
      return NextResponse.json(
        {
          success: false,
          error: `Proveedor '${body.proveedor}' no encontrado`,
        },
        { status: 404 }
      );
    }

    // Validación de campos obligatorios
    const requiredFields = ["nombre", "precio_compra", "precio_venta"];
    const missingFields = requiredFields.filter((field) => !(field in body));

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Campos obligatorios faltantes",
          missingFields,
        },
        { status: 400 }
      );
    }

    // Crear producto
    const nuevoProducto = await prisma.productos.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion || "",
        precio_compra: parseFloat(body.precio_compra),
        precio_venta: parseFloat(body.precio_venta),
        categoria_id: categoria.categoria_id,
        proveedor_id: proveedor.proveedor_id,
        stock_minimo: parseInt(body.stock_minimo) || 0,
        stock_maximo: parseInt(body.stock_maximo) || 100,
        created_at: new Date(),
      },
      include: {
        categoria: { select: { nombre_categoria: true } },
        proveedor: { select: { nombre_proveedor: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...nuevoProducto,
          categoria: nuevoProducto.categoria?.nombre_categoria,
          proveedor: nuevoProducto.proveedor?.nombre_proveedor,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
