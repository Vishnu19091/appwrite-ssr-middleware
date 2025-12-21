// src/app/api/user/route.js

import { getLoggedInUser } from "@/lib/server/appwrite";
import { NextResponse } from "next/server";

export async function GET() {
  // console.log(request);
  const user = await getLoggedInUser();
  if (user) return NextResponse.json(user);
  return NextResponse.json(
    { error: "Unauthorized", message: "User is not logged in" },
    { status: 401 }
  );
}
