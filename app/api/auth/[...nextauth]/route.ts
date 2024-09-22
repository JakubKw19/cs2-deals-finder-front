import { handler } from "@/lib/auth";
import { NextApiRequest } from "next";
// import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextRequest) {
    return handler(req, res);
}

export async function POST(req: NextRequest, res: NextRequest) {
    return handler(req, res);
}
