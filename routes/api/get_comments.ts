import { HandlerContext } from "$fresh/server.ts";
import { selectComments } from '~/utils/db.ts';

import type { Comment } from '~/utils/db.ts';

export type RequestType = { postId: number };
export type ResponseType = Array<Comment>;

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  const params: RequestType = await request.json();
  const result: ResponseType = await selectComments(params.postId);
  return Response.json(result);
};
