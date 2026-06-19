import { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username dan password wajib diisi." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await prisma.adminUser.findUnique({ where: { username } });

    if (!user) {
      return new Response(JSON.stringify({ error: "Username atau password salah." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return new Response(JSON.stringify({ error: "Username atau password salah." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = new Response(JSON.stringify({ success: true, username }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    const session = await getIronSession<{ admin: SessionData }>(
      request,
      response,
      sessionOptions
    );

    session.admin = { isLoggedIn: true, username };
    await session.save();

    return response;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan pada server." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
