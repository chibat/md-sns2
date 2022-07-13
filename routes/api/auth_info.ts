import { HandlerContext } from "$fresh/server.ts";
import { getAuthUrl, getGoogleUser, GoogleUser } from "~/utils/auth.ts";
import { selectUserByGoogleId, upsertUser, updateUser, AppUser } from "~/utils/db.ts";
import { LoginUser } from "~/utils/types.ts";

export type ResponseType = {
  loginUser?: LoginUser;
  authUrl?: string;
}

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  console.log(request.url);

  const googleUser = await getGoogleUser(request);
  if (googleUser) {
    const user = await getUser(googleUser);
    const loginUser: LoginUser = {
      userId: user.id,
      name: googleUser.name,
      picture: googleUser.picture,
      notification: user.notification,
    };
    const responseJson: ResponseType = { loginUser };
    return Response.json(responseJson);
  }

  const authUrl = getAuthUrl(request.url);
  const responseJson: ResponseType = { authUrl };
  return Response.json(responseJson);
};

async function getUser(googleUser: GoogleUser): Promise<AppUser> {
  const user = await selectUserByGoogleId(googleUser.id);
  if (user) {
    if (user.name !== googleUser.name || user.picture !== googleUser.picture) {
      await updateUser({id: user.id, name: googleUser.name, picture: googleUser.picture});
    }
    return user;
  }
  return await upsertUser({
    googleId: googleUser.id,
    name: googleUser.name,
    picture: googleUser.picture,
  });
}
