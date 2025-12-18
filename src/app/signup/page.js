// src/app/signup/page.jsx

import { createAdminClient } from "@/lib/server/appwrite";
import { signUpWithGithub } from "@/lib/server/oauth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function createSession(formData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  const { account } = await createAdminClient();

  const session = await account.createEmailPasswordSession({ email, password });

  // Storing the session in cookies
  const cookieStore = await cookies();
  cookieStore.set("appwrite-session", session.secret, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    expires: new Date(session.expire),
    path: "/",
  });

  redirect("/account");
}

export default async function SignUpPage() {
  return (
    <>
      <form action={createSession}>
        <input name="email" type="email" placeholder="Email" />
        <input
          name="password"
          type="password"
          minLength={8}
          placeholder="Password"
        />
        <button type="submit">Sign in</button>
      </form>
      <form action={signUpWithGithub}>
        <button type="submit">Sign up with GitHub</button>
      </form>
    </>
  );
}
