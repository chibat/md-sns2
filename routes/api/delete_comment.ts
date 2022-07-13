import { HandlerContext } from "$fresh/server.ts";
import { deleteComment, selectUserByGoogleId } from "~/utils/db.ts";
import { getGoogleUser } from "~/utils/auth.ts";

export type RequestType = { commentId: number };
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
      await deleteComment({id: requestJson.commentId, userId: user.id});
    }
  }

  return Response.json({});
};
