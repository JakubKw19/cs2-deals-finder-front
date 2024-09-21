import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { TokenSet } from "openid-client";
import { v4 as uuidv4 } from "uuid";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    return await NextAuth(req, res, {
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
                        "openid.return_to": `${process.env.NEXTAUTH_URL}/api/auth/callback/steam`,
                        "openid.realm": `${process.env.NEXTAUTH_URL}/api/auth/callback/steam`,
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
                            `http://${req.headers.host}`,
                        );
                        if (
                            typeof url.searchParams.get("openid.claimed_id") ===
                            "string"
                        ) {
                            let matches = url.searchParams
                                .get("openid.claimed_id")
                                ?.match(
                                    /^https:\/\/steamcommunity.com\/openid\/id\/([0-9]{17,25})/,
                                );
                            const steamid = matches![1].match(/^-?\d+$/)
                                ? matches![1]
                                : 0;
                            const tokenset = new TokenSet({
                                id_token: uuidv4(),
                                access_token: uuidv4(),
                                steamid: steamid,
                            });
                            // console.log(tokenset)
                            return { tokens: tokenset };
                        }
                        return { tokens: new TokenSet({}) };
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

                // token: {
                //     async request(ctx) {
                //         const token_params = {
                //             "openid.assoc_handle": req.query["openid.assoc_handle"],
                //             "openid.signed": req.query["openid.signed"],
                //             "openid.sig": req.query["openid.sig"],
                //             "openid.ns": "http://specs.openid.net/auth/2.0",
                //             "openid.mode": "check_authentication",
                //         };
                //         const signedValues = Array.isArray(req.query["openid.signed"]) ? req.query["openid.signed"] : [req.query["openid.signed"]];
                //         for (const val of signedValues) {
                //             //@ts-ignore
                //             token_params[`openid.${val}`] = req.query[`openid.${val}`];
                //         }

                //         const token_url = new URL("https://steamcommunity.com/openid/login");
                //         // const token_url_params = new URLSearchParams(token_params);
                //         //@ts-ignore
                //         token_url.search = token_url_params;
                //         const token_res = await fetch(token_url, {
                //             method: "POST",
                //             headers: {
                //                 "Accept-language": "en\r\n",
                //                 "Content-type": "application/x-www-form-urlencoded\r\n",
                //                 // "Content-Length": `${token_url_params.toString().length}\r\n`,
                //             },
                //             body: token_params.toString(),
                //         });
                //         const result = await token_res.text();
                //         if (result.match(/is_valid\s*:\s*true/i)) {
                //             if (typeof req.query["openid.claimed_id"] === "string") {
                //                 let matches = req.query["openid.claimed_id"]?.match(
                //                     /^https:\/\/steamcommunity.com\/openid\/id\/([0-9]{17,25})/
                //                 );
                //                 const steamid = matches![1].match(/^-?\d+$/) ? matches![1] : 0;
                //                 const tokenset = new TokenSet({
                //                     id_token: uuidv4(),
                //                     access_token: uuidv4(),
                //                     steamid: steamid,
                //                 });
                //                 return { tokens: tokenset };
                //             }
                //             return { tokens: new TokenSet({}) }

                //         } else {
                //             return { tokens: new TokenSet({}) };
                //         }
                //     },
                // },

                // idToken: false,
                // checks: ["none"],
                // profile(profile: any) {
                //     return {
                //         id: profile.steamid,
                //         image: profile.avatarfull,
                //         name: profile.personaname,
                //     };
                // },
                // clientId: "whateveryouwant",
            },
        ],
        pages: {
            signIn: "/", // Redirect here if not signed in
            // You can define other pages like `error`, `verifyRequest`, etc.
        },
        callbacks: {
            async redirect({ url, baseUrl }) {
                // Redirect to dashboard after successful sign-in
                return baseUrl + "/";
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
