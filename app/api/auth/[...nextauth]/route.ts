import { handler } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    return handler(req, res);
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    return handler(req, res);
}