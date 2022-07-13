import { HandlerContext } from "$fresh/server.ts";
import { deleteCookie, getCookies } from "std/http/cookie.ts";
import { revoke } from "~/utils/auth.ts";

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  console.log(request.url);
  const cookies = getCookies(request.headers);
  const accessToken = cookies["access"];
  if (accessToken) {
    await revoke(accessToken);
  }
  deleteCookie(request.headers, "access");
  deleteCookie(request.headers, "refresh");
  return Response.redirect("/");
};
