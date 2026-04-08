import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/schemas";
import { getBugFlags } from "@/lib/bugs/flags";
import { pickErrorMessage } from "@/lib/bugs/rules";

export async function POST(request: Request) {
  const bugFlags = getBugFlags();
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: pickErrorMessage(bugFlags, "Datos inválidos", "Credenciales incompletas")
      },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (!user || user.password !== parsed.data.password) {
    return NextResponse.json(
      {
        message: pickErrorMessage(bugFlags, "Email o contraseña incorrectos", "Auth failed")
      },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(AUTH_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
