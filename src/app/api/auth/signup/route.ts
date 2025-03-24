import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    return NextResponse.json(
      { message: "Usuario registrado", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("El error es:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
