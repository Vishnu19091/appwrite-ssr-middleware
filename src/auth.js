const { cookies } = require("next/headers");
const { createSessionClient } = require("./lib/server/appwrite");

const auth = {
  user: null,
  sessionCookie: null,

  getUser: async () => {
    auth.sessionCookie = (await cookies()).get("appwrite-session");

    try {
      const { account } = await createSessionClient();
      auth.user = await account.get();
    } catch (error) {
      console.error(error);
      auth.user = null;
      auth.sessionCookie = null;
    }

    return auth.user;
  },
};

export default auth;
