"use client";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="mt-20">{children}</div>;
}
