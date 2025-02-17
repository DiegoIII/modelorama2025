import { NextResponse } from "next/server";
import { AppDataSource } from "app/lib/data-source"; // ✅ Ajuste en la importación
import { Alumno } from "app/entities/Alumnos"; // ✅ Ajuste en la importación

// ✅ Conectar la base de datos antes de cada operación
async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("📌 Base de datos conectada correctamente.");
  }
}

// ✅ Obtener todos los alumnos (GET /api/alumnos)
export async function GET() {
  try {
    await connectDB();
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const alumnos = await alumnoRepository.find();

    return NextResponse.json(alumnos, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo alumnos:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// ✅ Crear un nuevo alumno (POST /api/alumnos)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nombre y email son obligatorios" },
        { status: 400 }
      );
    }

    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const newAlumno = alumnoRepository.create({ name, email });
    await alumnoRepository.save(newAlumno);

    return NextResponse.json(newAlumno, { status: 201 });
  } catch (error) {
    console.error("Error guardando alumno:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// ✅ Actualizar un alumno por ID (PUT /api/alumnos)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, name, email } = await req.json();

    if (!id || !name || !email) {
      return NextResponse.json(
        { error: "ID, nombre y email son obligatorios" },
        { status: 400 }
      );
    }

    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const alumno = await alumnoRepository.findOneBy({ id });

    if (!alumno) {
      return NextResponse.json(
        { error: "Alumno no encontrado" },
        { status: 404 }
      );
    }

    alumno.name = name;
    alumno.email = email;
    await alumnoRepository.save(alumno);

    return NextResponse.json(alumno, { status: 200 });
  } catch (error) {
    console.error("Error actualizando alumno:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// ✅ Eliminar un alumno por ID (DELETE /api/alumnos)
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID es obligatorio" }, { status: 400 });
    }

    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const alumno = await alumnoRepository.findOneBy({ id });

    if (!alumno) {
      return NextResponse.json(
        { error: "Alumno no encontrado" },
        { status: 404 }
      );
    }

    await alumnoRepository.remove(alumno);

    return NextResponse.json({ message: "Alumno eliminado" }, { status: 200 });
  } catch (error) {
    console.error("Error eliminando alumno:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
