import { Productos } from "app/entities/Productos";
import { AppDataSource } from "app/lib/data-source";
import { NextRequest, NextResponse } from "next/server";
import { Categoria } from "app/entities/Categoria";
import { Proveedor } from "app/entities/Proveedores";

// Inicializar la conexión a la base de datos
if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
}

const productoRepo = AppDataSource.getRepository(Productos);
const categoriaRepo = AppDataSource.getRepository(Categoria);
const proveedorRepo = AppDataSource.getRepository(Proveedor);

/**
 * Actualizar un producto por ID (PUT)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar que el ID sea un número válido
    const productoId = Number(params.id);
    if (isNaN(productoId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Buscar el producto en la base de datos
    const producto = await productoRepo.findOneBy({ producto_id: productoId });

    if (!producto) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Obtener datos del body
    const body = await req.json();
    const {
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock_minimo,
      stock_maximo,
      categoria_id,
      proveedor_id,
    } = body;

    // Buscar la categoría en la base de datos
    const categoria = await categoriaRepo.findOneBy({ categoria_id });
    if (!categoria) {
      return NextResponse.json(
        { success: false, message: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    // Buscar el proveedor en la base de datos
    const proveedor = await proveedorRepo.findOneBy({ proveedor_id });
    if (!proveedor) {
      return NextResponse.json(
        { success: false, message: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar solo los campos proporcionados
    productoRepo.merge(producto, {
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock_minimo,
      stock_maximo,
      categoria,
      proveedor,
    });

    const productoActualizado = await productoRepo.save(producto);

    return NextResponse.json({ success: true, data: productoActualizado });
  } catch (error) {
    console.error("Error en PUT /api/productos/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando producto" },
      { status: 500 }
    );
  }
}
