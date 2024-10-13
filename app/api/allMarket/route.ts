import { db } from "@/lib/db";
import { marketPrices } from "@/lib/schemas/schema";
import { displayedMarketPrice } from "@/types/displayedMarketPrice";
import { marketPriceForDB } from "@/types/servertypes/marketPrices";
import { NextResponse } from "next/server";

export async function GET() {
    const result = (await db.select().from(marketPrices).execute()).sort((a, b) => a.id - b.id);
    if (!result) {
        return NextResponse.error();
    }
    // let newData: displayedMarketPrice[] = [];
    const data = result as unknown as marketPriceForDB[];
    const newData = data.map((item: marketPriceForDB) => {
        // console.log(item);
        return ({
            id: item.id,
            market_hash_name: item.market_hash_name,
            buff163buy: typeof item.buff163Price?.highest_order?.price === 'number' ? item.buff163Price.highest_order.price : null,
            buff163sell: typeof item.buff163Price?.starting_at?.price === 'number' ? item.buff163Price.starting_at.price : null,
            steam24h: typeof item.steamPrice?.last_24h === 'number' ? item.steamPrice.last_24h : null,
            steam7d: typeof item.steamPrice?.last_7d === 'number' ? item.steamPrice.last_7d : null,
            steam30d: typeof item.steamPrice?.last_30d === 'number' ? item.steamPrice.last_30d : null,
            bitskins: typeof item.bitskinsPrice?.price === 'number' ? item.bitskinsPrice.price : null,
            skinport: typeof item.skinportPrice?.starting_at === 'number' ? item.skinportPrice.starting_at : null,
            csmoney: typeof item.csmoneyPrice?.price === 'number' ? item.csmoneyPrice.price : null,
            csfloat: typeof item.csfloatPrice?.price === 'number' ? item.csfloatPrice.price : null,
            csgotrader: typeof item.csgotraderPrice?.price === 'number' ? item.csgotraderPrice.price : null,
            lootfarm: typeof item.lootfarmPrice === 'number' ? item.lootfarmPrice : null,
            csgoempire: typeof item.csgoempirePrice === 'number' ? item.csgoempirePrice : null,
            youpin: typeof item.youpinPrice === 'number' ? item.youpinPrice : null,
            swapgg: typeof item.swapggPrice === 'number' ? item.swapggPrice : null,
            csgotm: typeof item.csgotmPrice === 'number' ? item.csgotmPrice : null,
        })

    });
    // console.log(newData);
    return NextResponse.json(newData);
}