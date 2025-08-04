// middleware.js

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Récupérer le token de session
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // URL de la page de connexion
  const url = req.nextUrl.clone();
  url.pathname = "/auth/signin";

  // Si l'utilisateur n'a pas de token et essaie d'accéder à une route protégée
  if (!token && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion
  if (token && req.nextUrl.pathname === "/auth/signin") {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/admin/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Le middleware s'applique à toutes ces routes
  matcher: ["/admin/:path*", "/auth/signin"],
};