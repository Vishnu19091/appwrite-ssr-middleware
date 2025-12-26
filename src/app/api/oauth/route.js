// src/app/api/oauth/route.js

import { createAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { account } = await createAdminClient();

  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const secret = request.nextUrl.searchParams.get("secret");

    // console.log({
    //   userID: userId,
    //   secret: secret,
    // });
    const ORIGIN = request.nextUrl.origin;

    const session = await account.createSession({ userId, secret });

    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    return NextResponse.redirect(`${ORIGIN}/account`);
  } catch (error) {
    return NextResponse.json(error);
  }
}
