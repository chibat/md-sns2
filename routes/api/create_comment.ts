import { HandlerContext } from "$fresh/server.ts";
import { insertComment, selectUserByGoogleId } from "../../utils/db.ts";
import { getGoogleUser } from "../../utils/auth.ts";

export type RequestType = { postId: number; source: string };
export type ResponseType = {};

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  console.log(request.url);

  const googleUser = await getGoogleUser(request);
  if (!googleUser) {
    return new Response("", {status: 401});
  }

  const requestJson: RequestType = await request.json();
  if (requestJson) {
    if (requestJson.source.length > 5000) {
      return new Response("", {status: 400});
    }
    const user = await selectUserByGoogleId(googleUser.id);
    if (user) {
      await insertComment({
        postId: requestJson.postId,
        userId: user.id,
        source: requestJson.source,
      });
      const responseJson: ResponseType = {};
      return Response.json(responseJson);
    }
  }

  return Response.json({});
};
