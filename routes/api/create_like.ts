import { HandlerContext } from "$fresh/server.ts";
import { insertLike, selectUserByGoogleId } from "~/utils/db.ts";
import { getGoogleUser } from "~/utils/auth.ts";

export type RequestType = { postId: number; };
export type ResponseType = {};

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  console.log(request.url);

  const googleUser = await getGoogleUser(request);
  if (!googleUser) {
    return Response.json({}, {status: 401});
  }

  const requestJson: RequestType = await request.json();
  if (requestJson) {
    const user = await selectUserByGoogleId(googleUser.id);
    if (user) {
      await insertLike({
        userId: user.id,
        postId: requestJson.postId,
      });
      const responseJson: ResponseType = {};
      return Response.json(responseJson);
    }
  }

  return Response.json({});
};
