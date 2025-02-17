import { NextResponse } from "next/server";
import { AppDataSource } from "app/lib/data-source"; // Ajuste en la importación
import { Animal } from "app/entities/Animales"; // Ajuste en la importación

// ✅ Conectar la base de datos antes de cada operación
async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("📌 Base de datos conectada correctamente.");
  }
}

// ✅ Obtener todos los animales (GET /api/animales)
export async function GET() {
  try {
    await connectDB();
    const animalRepository = AppDataSource.getRepository(Animal);
    const animales = await animalRepository.find();

    return NextResponse.json(animales, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo animales:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// ✅ Crear un nuevo animal (POST /api/animales)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { nombre } = await req.json();

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const animalRepository = AppDataSource.getRepository(Animal);
    const newAnimal = animalRepository.create({ nombre });
    await animalRepository.save(newAnimal);

    return NextResponse.json(newAnimal, { status: 201 });
  } catch (error) {
    console.error("Error guardando animal:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// ✅ Actualizar un animal por ID (PUT /api/animales)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, nombre } = await req.json();

    if (!id || !nombre) {
      return NextResponse.json(
        { error: "ID y nombre son obligatorios" },
        { status: 400 }
      );
    }

    const animalRepository = AppDataSource.getRepository(Animal);
    const animal = await animalRepository.findOneBy({ id });

    if (!animal) {
      return NextResponse.json(
        { error: "Animal no encontrado" },
        { status: 404 }
      );
    }

    animal.nombre = nombre;
    await animalRepository.save(animal);

    return NextResponse.json(animal, { status: 200 });
  } catch (error) {
    console.error("Error actualizando animal:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// ✅ Eliminar un animal por ID (DELETE /api/animales)
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID es obligatorio" }, { status: 400 });
    }

    const animalRepository = AppDataSource.getRepository(Animal);
    const animal = await animalRepository.findOneBy({ id });

    if (!animal) {
      return NextResponse.json(
        { error: "Animal no encontrado" },
        { status: 404 }
      );
    }

    await animalRepository.remove(animal);

    return NextResponse.json({ message: "Animal eliminado" }, { status: 200 });
  } catch (error) {
    console.error("Error eliminando animal:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
