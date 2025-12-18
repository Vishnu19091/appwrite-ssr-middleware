// src/app/api/signin/route.js
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/server/appwrite";

export async function POST(request) {
  const { email, password } = await request.json();

  const { account } = await createAdminClient();

  const session = await account.createEmailPasswordSession({ email, password });

  // console.log(session);
  const cookieStore = await cookies();
  cookieStore.set("appwrite-session", session.secret, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    expires: new Date(session.expire),
    path: "/",
  });

  return Response.json({ ok: true });
}
