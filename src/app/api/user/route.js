// src/app/api/user/route.js

import { getLoggedInUser } from "@/lib/server/appwrite";
import { NextResponse } from "next/server";

export async function GET() {
  // console.log(request);
  try {
    const user = await getLoggedInUser();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
