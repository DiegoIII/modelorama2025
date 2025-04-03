// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

  // Redirigir si ya está autenticado y trata de acceder a rutas de auth
  if (isAuthRoute) {
    if (token) {
      try {
        await jwtVerify(token, SECRET);
        return NextResponse.redirect(new URL("/", req.url));
      } catch {
        // Token inválido, eliminar la cookie y permitir el acceso a login/register
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
  }

  // Proteger rutas que no son de auth
  if (!isAuthRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error("Token inválido o expirado:", error);
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
