export const projectConfig = {
  nextauth_url: `${process.env.NEXTAUTH_URL ?? `http://100.122.79.62`}:${process.env.FRONTEND_PORT}`,
  trpc_url: `${process.env.TRPC_SERVER_URL ?? `http://100.122.79.62`}:${process.env.PORT}`,
};
