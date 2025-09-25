"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

export default function Page() {
  return (
    <div className="flex min-h-screen items-start justify-center md:items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => {
              signIn("steam");
            }}
          >
            Sign in with steam
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
