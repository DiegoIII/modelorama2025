import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "app/lib/prisma";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("La variable de entorno JWT_SECRET no está definida");
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "El email y la contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Validar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        message: "Login exitoso",
        token,
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en el login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
