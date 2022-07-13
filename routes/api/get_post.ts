import { HandlerContext } from "$fresh/server.ts";
import { getGoogleUser } from "~/utils/auth.ts";
import { selectPost, selectUserByGoogleId, selectLikes } from "~/utils/db.ts";

import type { ResponsePost } from "~/utils/types.ts";

export type RequestType = { postId: number };
export type ResponseType = ResponsePost | null;

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  console.info(request.url);
  const params: RequestType = await request.json();

  const googleUser = await getGoogleUser(request);
  const user = googleUser ? await selectUserByGoogleId(googleUser.id) : null;
  const likedPostIds = user
  ? await selectLikes({ userId: user.id, postIds: [params.postId] })
  : [];

  const p = await selectPost(params.postId);
  if (p) {
    const post: ResponsePost = {
      id: p.id,
      user_id: p.user_id,
      source: p.source,
      updated_at: p.updated_at,
      created_at: p.created_at,
      comments: p.comments,
      name: p.name,
      picture: p.picture,
      likes: p.likes,
      liked: likedPostIds.includes(p.id),
    };
    return Response.json(post);
  } else {
    return Response.json(null);
  }
};
