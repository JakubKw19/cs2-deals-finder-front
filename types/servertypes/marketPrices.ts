
// export type traderResponse = 
export type marketJson = {
    [market_hash_name: string]: steamPrice | buff163Price | bitskinsPrice | skinportPrice | csmoneyPrice | csfloatPrice | csgotraderPrice | number | null;
}

export type marketPrice = {
    [market_hash_name: string]: {
        steam: steamPrice;
        buff163: buff163Price;
        bitskins: bitskinsPrice;
        skinport: skinportPrice;
        csmoney: csmoneyPrice;
        csfloat: csfloatPrice;
        csgotrader: csgotraderPrice;
        lootfarm: lootfarmPrice;
        csgoempire: csgoempirePrice;
        youpin: youpinPrice;
        swapgg: swapggPrice;
        csgotm: csgotmPrice;
    };
}

export type marketPriceForDB = {
    id: number;
    market_hash_name: string;
    steamPrice: steamPrice;
    buff163Price: buff163Price;
    bitskinsPrice: bitskinsPrice;
    skinportPrice: skinportPrice;
    csmoneyPrice: csmoneyPrice;
    csfloatPrice: csfloatPrice;
    csgotraderPrice: csgotraderPrice;
    lootfarmPrice: lootfarmPrice;
    csgoempirePrice: csgoempirePrice;
    youpinPrice: youpinPrice;
    swapggPrice: swapggPrice;
    csgotmPrice: csgotmPrice;
}

export type steamPrice = {
    last_24h: number;
    last_7d: number;
    last_30d: number;
    last_90d: number;
} | null;

export type buff163Price = {
    startingAt: {
        price: number;
        doppler?: doppler;
    }
    highest_order: {
        price: number;
        doppler?: doppler;
    }
} | null;

export type bitskinsPrice = {
    price: number;
    instant_sale_price: number;
} | null;

export type skinportPrice = {
    starting_at: number;
    suggested_price: number;
} | null;

export type csmoneyPrice = {
    price: number;
    doppler?: doppler;
} | null;

export type csfloatPrice = {
    price: number;
    doppler?: doppler;
} | null;

export type csgotraderPrice = {
    price: number;
    doppler?: doppler;
} | null;

export type lootfarmPrice = number | null | {};

export type csgoempirePrice = number | null | {};

export type youpinPrice = number | null | {};

export type swapggPrice = number | null | {};

export type csgotmPrice = number | null | {};

export type doppler = {
    "Ruby"?: number;
    "Black Pearl"?: number;
    "Sapphire"?: number;
    "Emerald"?: number;
    "Phase 1": number;
    "Phase 2": number;
    "Phase 3": number;
    "Phase 4": number;
}

