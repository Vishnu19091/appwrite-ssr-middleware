// src/app/api/user/route.js

import { getLoggedInUser } from "@/lib/server/appwrite";

export async function GET(request) {
  // console.log(request);
  try {
    const user = await getLoggedInUser();
    return Response.json({ user });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
