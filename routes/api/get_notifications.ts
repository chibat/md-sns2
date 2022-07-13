import { HandlerContext } from "$fresh/server.ts";
import { getGoogleUser } from "~/utils/auth.ts";
import { selectNotifications, selectUserByGoogleId } from "~/utils/db.ts";

import type { AppNotification } from "~/utils/db.ts";

export type ResponseType = Array<AppNotification>;

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  const googleUser = await getGoogleUser(request);
  if (!googleUser) {
    return Response.json([]);
  }
  const user = await selectUserByGoogleId(googleUser.id);
  if (!user) {
    return Response.json([]);
  }
  const userId = user.id;
  const result = await selectNotifications(userId);

  return Response.json(result);
};
