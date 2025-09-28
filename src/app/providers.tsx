// frontend/src/app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, getTrpcClient } from "../utils/trpc";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const trpcClient = getTrpcClient();

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
