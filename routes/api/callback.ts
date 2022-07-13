import { HandlerContext } from "$fresh/server.ts";
import { setCookie } from "std/http/cookie.ts";
import { getCode, getTokenByCode, getCallbackUrl } from "../../utils/auth.ts";
import { clientId, clientSecret } from "../../utils/env.ts";

export const handler = async (request: Request, _ctx: HandlerContext): Promise<Response> => {
  console.log(request.url);
  const code = getCode(request.url);
  if (code) {
    const redirectUri = getCallbackUrl(request.url);
    const { access_token, refresh_token } = await getTokenByCode(
      clientId,
      clientSecret,
      redirectUri,
      code,
    );
    if (access_token) {
      setCookie(request.headers, {
        name: "access",
        value: access_token,
        sameSite: "Strict",
        httpOnly: true,
        secure: true,
      });
    }
    if (refresh_token) {
      setCookie(request.headers, {
        name: "refresh",
        value: refresh_token,
        sameSite: "Strict",
        httpOnly: true,
        secure: true,
      });
    }
  }
  return Response.redirect("/");
};
