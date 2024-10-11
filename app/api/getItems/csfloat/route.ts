import { NextRequest, NextResponse } from "next/server";

let page = 0;

export async function GET(req: NextRequest, res: NextRequest) {
    const response = await fetch(`https://csfloat.com/api/v1/listings?limit=50&page=${page}`, {
        method: 'GET',
        headers: {
            'Authorization': `${process.env.CSFLOAT_API_KEY}`, // Add your API key if needed
            'Content-Type': 'application/json',
        },
    });

    if (!response) {
        return NextResponse.json({
            status: 500,
            body: { error: 'Internal Server Error' },
        });
    }

    if (!response.ok) {
        return NextResponse.json({
            status: response.status,
            body: { error: 'Internal Server Error' },
        });
    }
    const data = await response.json();
    return NextResponse.json({
        status: 200,
        body: data,
    });

}