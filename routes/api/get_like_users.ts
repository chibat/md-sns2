import { HandlerContext } from "$fresh/server.ts";
import { selectLikeUsers } from "~/utils/db.ts";
import { defaultString } from "~/utils/utils.ts";

import type { User } from "~/utils/types.ts";

export type RequestType = { postId: number };
export type ResponseType = Array<User>;

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  console.log(request.url);
  const params: RequestType = await request.json();
  const results = (await selectLikeUsers(params.postId)).map(
    (appUser): User => {
      return {
        userId: appUser.id,
        name: defaultString(appUser.name),
        picture: defaultString(appUser.picture),
      };
    },
  );
  return Response.json(results);
};
