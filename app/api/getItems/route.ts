import { fetchItems } from "@/scripts/itemData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextRequest) {
    // return handler(req, res);
    let items;
    const itemParser = await fetchItems();
    if (!itemParser) {
        console.error('Failed to parse items_game.txt');
    } else {
        items = itemParser.getFullResponse();
        console.log(items);
    }
    return NextResponse.json({ status: 200, body: items });
}