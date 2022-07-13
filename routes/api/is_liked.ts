import { HandlerContext } from "$fresh/server.ts";
import { getGoogleUser } from "~/utils/auth.ts";
import { selectLikes, selectUserByGoogleId } from "~/utils/db.ts";

export type RequestType = { postId: number };

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  console.log(request.url);
  const params: RequestType = await request.json();
  const googleUser = await getGoogleUser(request);
  const user = googleUser ? await selectUserByGoogleId(googleUser.id) : null;
  if (user) {
    const results = await selectLikes({
      userId: user.id,
      postIds: [params.postId],
    }); // TODO: to one postId
    return Response.json(results.length === 1);
  } else {
    return Response.json(null);
  }
};
