import { HandlerContext } from "$fresh/server.ts";
import { updatePost, selectUserByGoogleId } from "~/utils/db.ts";
import { getGoogleUser } from "~/utils/auth.ts";

export type RequestType = { postId: number, source: string };
export type ResponseType = {postId: number};

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  console.log(request.url);

  const googleUser = await getGoogleUser(request);
  if (!googleUser) {
    return Response.json({}, {status: 401});
  }
  const user = await selectUserByGoogleId(googleUser.id);
  if (!user) {
    return Response.json({}, {status: 401});
  }

  const requestJson: RequestType = await request.json();
  if (requestJson) {
    if (requestJson.source.length > 10000) {
      return Response.json({}, {status: 400});
    }
    await updatePost({postId: requestJson.postId, userId: user.id,  source: requestJson.source});
    return Response.json(null);
  }

  return Response.json(null);
};
