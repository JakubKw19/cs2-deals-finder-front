import NextAuth, { NextAuthOptions } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { authConfig } from "./auth.config";
import { NextRequest } from "next/server";
import { NextApiRequest } from "next";
import { projectConfig } from "@/config";

// The configuration object type is NextAuthConfig for the new v5 structure

export const { auth } = await NextAuth({
  providers: [
    {
      id: "steam",
      name: "steam",
      type: "oauth",
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
      clientId: "whatever", // Not used in OpenID, but good practice
      clientSecret: process.env.STEAM_CLIENT_SECRET, // Not used in OpenID, but good practice
      checks: ["none"],
      userinfo: {
        async request(ctx) {
          // console.log(ctx)
          console.log(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${ctx.provider.clientSecret}&steamids=${ctx.tokens.steamid}`,
          );
          const user_result = await fetch(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${ctx.provider.clientSecret}&steamids=${ctx.tokens.steamid}`,
          );
          const json = await user_result.json();
          return json.response.players[0];
        },
      },
      token: {
        async request(ctx) {
          const url = new URL(ctx.params.url as string);
          if (typeof url.searchParams.get("openid.claimed_id") === "string") {
            let matches = url.searchParams
              .get("openid.claimed_id")
              ?.match(
                /^https:\/\/steamcommunity.com\/openid\/id\/([0-9]{17,25})/,
              );
            const steamid = matches![1].match(/^-?\d+$/) ? matches![1] : 0;
            const tokenset = {
              id_token: uuidv4(),
              access_token: uuidv4(),
              steamid: steamid,
            };
            // console.log(tokenset)
            return { tokens: tokenset };
          }
          return { tokens: {} };
        },
      },
      profile(profile) {
        // Handle the Steam user profile response
        // console.log(profile)
        // const steamId = profile["openid.claimed_id"].split("/").pop();
        return {
          id: profile.steamid,
          name: profile.personaname,
          image: profile.avatarfull,
        };
      },
    },
  ],
  pages: {
    signIn: "/", // Redirect here if not signed in
    // You can define other pages like `error`, `verifyRequest`, etc.
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful sign-in
      return baseUrl + "/home";
    },
    async jwt({ token, account, profile }) {
      // console.log(token)
      // console.log(account)
      // Add steam id to the token after successful login
      // if (account && profile) {
      //     token.id = profile.steamid;
      //     token.name = profile.name;
      //     token.picture = profile.image;
      // }
      return token;
    },
    async session({ session, token }) {
      // console.log(token)
      // Send the token to the session for use in the app
      // session.id = token.id;
      // session.name = token.name;
      // session.picture = token.picture;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export const handler = async (req: NextRequest, res: any) => {
  const apiReq = req as unknown as NextApiRequest;
  return await NextAuth(apiReq, res, {
    providers: [
      {
        id: "steam",
        name: "steam",
        type: "oauth",
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
        clientId: "whatever", // Not used in OpenID, but good practice
        clientSecret: process.env.STEAM_CLIENT_SECRET, // Not used in OpenID, but good practice
        checks: ["none"],
        userinfo: {
          async request(ctx) {
            // console.log(ctx)
            console.log(
              `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${ctx.provider.clientSecret}&steamids=${ctx.tokens.steamid}`,
            );
            const user_result = await fetch(
              `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${ctx.provider.clientSecret}&steamids=${ctx.tokens.steamid}`,
            );
            const json = await user_result.json();
            return json.response.players[0];
          },
        },
        token: {
          async request(ctx) {
            const url = new URL(
              req.url || "",
              `http://${req.headers.get("host")}`,
            );
            if (typeof url.searchParams.get("openid.claimed_id") === "string") {
              let matches = url.searchParams
                .get("openid.claimed_id")
                ?.match(
                  /^https:\/\/steamcommunity.com\/openid\/id\/([0-9]{17,25})/,
                );
              const steamid = matches![1].match(/^-?\d+$/) ? matches![1] : 0;
              const tokenset = {
                id_token: uuidv4(),
                access_token: uuidv4(),
                steamid: steamid,
              };
              // console.log(tokenset)
              return { tokens: tokenset };
            }
            return { tokens: {} };
          },
        },
        profile(profile) {
          // Handle the Steam user profile response
          // console.log(profile)
          // const steamId = profile["openid.claimed_id"].split("/").pop();
          return {
            id: profile.steamid,
            name: profile.personaname,
            image: profile.avatarfull,
          };
        },
      },
    ],
    pages: {
      signIn: "/", // Redirect here if not signed in
      // You can define other pages like `error`, `verifyRequest`, etc.
    },
    callbacks: {
      async redirect({ url, baseUrl }) {
        // Redirect to dashboard after successful sign-in
        return baseUrl + "/home";
      },
      async jwt({ token, account, profile }) {
        // console.log(token)
        // console.log(account)
        // Add steam id to the token after successful login
        // if (account && profile) {
        //     token.id = profile.steamid;
        //     token.name = profile.name;
        //     token.picture = profile.image;
        // }
        return token;
      },
      async session({ session, token }) {
        // console.log(token)
        // Send the token to the session for use in the app
        // session.id = token.id;
        // session.name = token.name;
        // session.picture = token.picture;
        return session;
      },
    },

    secret: process.env.NEXTAUTH_SECRET,
  });
};
