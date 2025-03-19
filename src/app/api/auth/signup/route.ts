import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "app/lib/prisma";

export async function POST(req: Request) {
  try {
    // Verificar el Content-Type
    if (req.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Formato de datos incorrecto. Usa 'application/json'" },
        { status: 400 }
      );
    }

    // Intentar obtener los datos del body
    const body = await req.json();
    console.log("Datos recibidos en el servidor:", body); // Debugging

    if (!body) {
      return NextResponse.json(
        { error: "No se enviaron datos en la solicitud" },
        { status: 400 }
      );
    }

    const { email, password, name } = body;

    // Validar que los datos no estén vacíos
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 409 }
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    return NextResponse.json(
      { message: "Usuario registrado exitosamente", user },
      { status: 201 }
    );
  } catch (error) {
    // Asegurarse de que el error es un objeto
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en el servidor:", errorMessage);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
