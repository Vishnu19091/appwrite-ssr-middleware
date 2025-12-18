// src/app/account/page.jsx

import { createSessionClient } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function signOut() {
  "use server";

  const { account } = await createSessionClient();

  const cookieStore = await cookies();
  cookieStore.delete("appwrite-session");

  await account.deleteSession("current");

  redirect("/signup");
}

export default async function HomePage() {
  let user;

  try {
    const { account } = await createSessionClient();
    user = await account.get();
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <ul>
        <li>
          <strong>Email:</strong> {user.email}
        </li>
        <li>
          <strong>Name:</strong> {user.name}
        </li>
        <li>
          <strong>ID:</strong> {user.$id}
        </li>
      </ul>

      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
    </>
  );
}
