// src/lib/server/appwrite.js
"use server";
import { Client, Account } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const cookieStore = await cookies();
  const session = cookieStore.get("appwrite-session");

  if (!session || !session.value) {
    return null;
  }

  if (session.value) client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.NEXT_APPWRITE_KEY);

  return {
    get account() {
      return new Account(client);
    },
  };
}

// we use request to get the cookies from the request
export async function getLoggedInUser() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  // Get the session cookie from the request
  const sessionCookie = (await cookies()).get("appwrite-session"); // The name might vary

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  // Manually set the session cookie on the client for server-side requests
  if (sessionCookie.value) client.setSession(sessionCookie.value);

  const account = new Account(client);

  try {
    // Attempt to get the user details with the active session
    const user = await account.get();

    // console.log(user.prefs);
    return user;
  } catch (error) {
    // No active session or user not logged in
    console.error("Failed to get user:", error);
    return error;
  }
}

export async function signOut() {
  const { account } = await createSessionClient();

  const cookieStore = await cookies();
  cookieStore.delete("appwrite-session");

  await account.deleteSession("current");

  redirect("/signup");
}
