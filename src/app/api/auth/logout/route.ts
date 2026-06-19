import { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function POST(request: NextRequest) {
  const response = new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  const session = await getIronSession(request, response, sessionOptions);
  session.destroy();
  await session.save();

  return response;
}
