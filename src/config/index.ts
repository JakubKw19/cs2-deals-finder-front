export const projectConfig = {
  nextauth_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL ?? `http://100.122.79.62`}:${process.env.NEXT_PUBLIC_FRONTEND_PORT}`,
  trpc_url: `${process.env.NEXT_PUBLIC_TRPC_SERVER_URL ?? `http://100.122.79.62`}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`,
};
