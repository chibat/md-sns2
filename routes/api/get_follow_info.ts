import { HandlerContext } from "$fresh/server.ts";
import {
  judgeFollowing,
  selectCountFollower,
  selectCountFollowing,
  selectUserByGoogleId,
} from "~/utils/db.ts";
import { getGoogleUser } from "~/utils/auth.ts";

export type RequestType = { userId: number };
export type ResponseType = {
  following: string;
  followers: string;
  isFollowing: boolean;
};

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  const params: RequestType = await request.json();
  const following = await selectCountFollowing(params.userId);
  const followers = await selectCountFollower(params.userId);

  const isFollowing = await (async () => {
    const googleUser = await getGoogleUser(request);
    if (googleUser) {
      const loginUser = await selectUserByGoogleId(googleUser.id);
      if (loginUser) {
        return await judgeFollowing({
          userId: loginUser.id,
          followingUserId: params.userId,
        });
      }
    }
    return false;
  })();

  return Response.json({ following, followers, isFollowing });
};
