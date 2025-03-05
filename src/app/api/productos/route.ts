import { Productos } from "app/entities/Productos";
import { AppDataSource } from "app/lib/data-source";
import { NextRequest, NextResponse } from "next/server";

// 🟢 Obtener todos los productos (GET /api/productos)
export async function GET() {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const productosRepo = AppDataSource.getRepository(Productos);
    const productos = await productosRepo.find();

    return NextResponse.json(productos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo los productos" },
      { status: 500 }
    );
  }
}

// 🔵 Crear un nuevo producto (POST /api/productos)
export async function POST(req: NextRequest) {
  try {
    const {
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock_minimo,
      stock_maximo,
      categoria,
      proveedor,
    } = await req.json();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const productosRepo = AppDataSource.getRepository(Productos);

    const nuevoProducto = productosRepo.create({
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock_minimo,
      stock_maximo,
      categoria,
      proveedor,
    });

    await productosRepo.save(nuevoProducto);
    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creando el producto" },
      { status: 500 }
    );
  }
}

// 🟠 Actualizar un producto por ID (PUT /api/productos/:id)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const {
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock_minimo,
      stock_maximo,
      categoria,
      proveedor,
    } = await req.json();
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const productosRepo = AppDataSource.getRepository(Productos);

    const producto = await productosRepo.findOneBy({ producto_id: id });
    if (!producto)
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );

    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.precio_compra = precio_compra;
    producto.precio_venta = precio_venta;
    producto.stock_minimo = stock_minimo;
    producto.stock_maximo = stock_maximo;
    producto.categoria = categoria;
    producto.proveedor = proveedor;

    await productosRepo.save(producto);

    return NextResponse.json(producto, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error actualizando el producto" },
      { status: 500 }
    );
  }
}

// 🔴 Eliminar un producto por ID (DELETE /api/productos/:id)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const productosRepo = AppDataSource.getRepository(Productos);

    const producto = await productosRepo.findOneBy({ producto_id: id });
    if (!producto)
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );

    await productosRepo.remove(producto);
    return NextResponse.json(
      { message: "Producto eliminado" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error eliminando el producto" },
      { status: 500 }
    );
  }
}
