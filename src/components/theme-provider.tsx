"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps
  extends React.ComponentProps<typeof NextThemesProvider> {}

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Must render children directly, not wrap in { children }
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
