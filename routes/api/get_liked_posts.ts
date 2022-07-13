import { HandlerContext } from "$fresh/server.ts";
import { getGoogleUser } from "~/utils/auth.ts";
import { ResponsePost } from "~/utils/types.ts";
import {
  selectLikedPosts,
  selectLikedPostsByGtId,
  selectLikedPostsByLtId,
  selectLikes,
  selectUserByGoogleId,
} from "~/utils/db.ts";

export type RequestType = {
  postId?: number;
  direction?: "next" | "previous";
};

export type ResponseType = Array<ResponsePost>;

async function execute(
  params: RequestType,
  request: Request,
): Promise<ResponseType> {
  console.log(JSON.stringify(params));

  const googleUser = await getGoogleUser(request);
  const user = googleUser ? await selectUserByGoogleId(googleUser.id) : null;

  if (!user) {
    return [];
  }

  const posts = await (() => {
    if (params.direction === "next" && params.postId) {
      return selectLikedPostsByLtId({ userId: user.id, ltId: params.postId });
    } else if (params.direction === "previous" && params.postId) {
      return selectLikedPostsByGtId({ userId: user.id, gtId: params.postId });
    }
    return selectLikedPosts(user.id);
  })();

  const likedPostIds = user
    ? await selectLikes({
      userId: user.id,
      postIds: posts.map((post) => post.id),
    })
    : [];

  return posts.map((p) => {
    return {
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
  });
}

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  const params: RequestType = await request.json();
  const result: ResponseType = await execute(params, request);
  return Response.json(result);
};
