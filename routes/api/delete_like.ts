import { HandlerContext } from "$fresh/server.ts";
import { deleteLike, selectUserByGoogleId } from "~/utils/db.ts";
import { getGoogleUser } from "~/utils/auth.ts";

export type RequestType = { postId: number };
export type ResponseType = {};

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  console.log(request.url);

  const googleUser = await getGoogleUser(request);
  if (!googleUser) {
    return Response.json({}, {status: 401});
  }
  const user = await selectUserByGoogleId(googleUser.id);
  const requestJson: RequestType = await request.json();
  if (requestJson && user) {
    await deleteLike({ userId: user.id, postId: requestJson.postId });
    return Response.json({});
  }

  return Response.json(null);
};
