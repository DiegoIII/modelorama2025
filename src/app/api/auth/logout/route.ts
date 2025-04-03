import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Eliminar la cookie `token`
  (await cookies()).delete("token");

  return NextResponse.json({ message: "Sesión cerrada correctamente" });
}
