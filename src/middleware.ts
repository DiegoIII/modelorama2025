import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  // Obtenemos el token de las cookies
  const token = req.cookies.get("token")?.value;

  // Si no existe token, redirige a /login
  if (!token) {
    console.log("No existe token");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verificamos el token
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch (error) {
    console.error("Token inválido o expirado:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
