import { HandlerContext } from "$fresh/server.ts";
import { insertPost, selectUserByGoogleId } from "~/utils/db.ts";
import { getGoogleUser } from "~/utils/auth.ts";

export type RequestType = { source: string };
export type ResponseType = { postId: number };

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  console.log(request.url);

  const googleUser = await getGoogleUser(request);
  if (!googleUser) {
    return Response.json({}, {status: 401});
  }

  const requestJson: RequestType = await request.json();
  if (requestJson) {
    if (requestJson.source.length > 10000) {
      return Response.json({}, {status: 400});
    }
    const user = await selectUserByGoogleId(googleUser.id);
    if (user) {
      const postId = await insertPost({
        userId: user.id,
        source: requestJson.source,
      });
      const responseJson: ResponseType = { postId };
      return Response.json(responseJson);
    }
  }

  return Response.json({});
};
