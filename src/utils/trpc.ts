import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../packages/index"; // import shared type
import { projectConfig } from "@/config";

export const trpc = createTRPCReact<AppRouter>();

export function getTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${projectConfig.trpc_url}/trpc`, // point to backend
      }),
    ],
  });
}
