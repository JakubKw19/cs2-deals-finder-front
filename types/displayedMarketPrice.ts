export type displayedMarketPrice = {
    id: number;
    market_hash_name: string;
    steam24h: number | null;
    steam7d: number | null;
    steam30d: number | null;
    buff163buy: number | null;
    buff163sell: number | null;
    bitskins: number | null;
    skinport: number | null;
    csmoney: number | null;
    csfloat: number | null;
    csgotrader: number | null;
    lootfarm: number | null;
    csgoempire: number | null;
    youpin: number | null;
    swapgg: number | null;
    csgotm: number | null;
}

export type displayedPreviewPrices = {
    id: number;
    market_hash_name: string;
    marketBuy: number | null;
    marketSell: number | null;
}