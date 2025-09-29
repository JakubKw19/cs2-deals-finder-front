import { projectConfig } from "@/config";
import { NextAuthOptions } from "next-auth";
import { v4 as uuidv4 } from "uuid";

export const authConfig = {
  // The 'oauth' type is an alias for a provider that follows
  // the standard OAuth 2.0 flow. For OpenID Connect providers like Steam,
  // which use OpenID 2.0, you must use a custom provider.
  // The structure below is correct for a custom provider, but the
  // official documentation often suggests setting type: "oidc"
  // or simply ensuring your custom provider object is structurally sound.
  providers: [
    {
      id: "steam",
      name: "Steam",
      type: "oauth", // Note: Using "oauth" is fine, but it's a non-standard OAuth flow.
      authorization: {
        url: "https://steamcommunity.com/openid/login",
        params: {
          "openid.ns": "http://specs.openid.net/auth/2.0",
          "openid.mode": "checkid_setup",
          "openid.return_to": `${projectConfig.nextauth_url}/api/auth/callback/steam`,
          "openid.realm": `${projectConfig.nextauth_url}/api/auth/callback/steam`,
          "openid.identity":
            "http://specs.openid.net/auth/2.0/identifier_select",
          "openid.claimed_id":
            "http://specs.openid.net/auth/2.0/identifier_select",
        },
      },
      // Note: clientId is not used by OpenID, but it's required by Auth.js for the type.
      clientId: "whatever",
      // Steam uses an API key, not a client secret. This is used in the userinfo request.
      clientSecret: process.env.STEAM_API_KEY,
      checks: ["none"],
      userinfo: {
        async request(ctx) {
          const user_result = await fetch(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${ctx.provider.clientSecret}&steamids=${ctx.tokens.steamid}`,
          );
          const json = await user_result.json();
          return json.response.players[0];
        },
      },
      token: {
        async request(ctx) {
          // This token function is needed to extract the steamid from the URL.
          const url = new URL(ctx.params.url as string);
          if (typeof url.searchParams.get("openid.claimed_id") === "string") {
            const matches = url.searchParams
              .get("openid.claimed_id")
              ?.match(
                /^https:\/\/steamcommunity.com\/openid\/id\/([0-9]{17,25})/,
              );
            // Added check for matches[1] existence before using it
            const steamid =
              matches && matches[1] && matches[1].match(/^-?\d+$/)
                ? matches[1]
                : "0"; // Using "0" instead of 0 for type safety with steamid
            const tokenset = {
              // Standard OAuth tokens are required, even if fake for OpenID 2.0
              id_token: uuidv4(),
              access_token: uuidv4(),
              steamid: steamid, // Custom token field for use in userinfo
            };
            return { tokens: tokenset };
          }
          return { tokens: {} };
        },
      },
      profile(profile) {
        // This maps the Steam profile response to the standard Auth.js profile object.
        return {
          id: profile.steamid,
          name: profile.personaname,
          image: profile.avatarfull,
        };
      },
    },
  ],
  pages: {
    // Redirect unauthenticated users to this page
    signIn: "/",
  },
  callbacks: {
    // This callback runs after sign-in and a few other events.
    async jwt({ token, account }) {
      // Add Steam ID to the token after successful login.
      // account.providerAccountId is the value from profile(profile).id
      if (account) {
        token.id = account.providerAccountId;
      }
      return token;
    },
    // This callback is used to update the session object on the client side.
    async session({ session, token }) {
      // session.user.id = token.id; // Correctly expose the steamid on the session object
      return session;
    },
    async redirect({ baseUrl }) {
      // Always redirect to the base URL after authentication.
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions; // Use satisfies NextAuthConfig
