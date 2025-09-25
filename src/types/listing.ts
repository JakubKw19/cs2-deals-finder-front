export type Listing = {
    id: string;
    created_at: string;
    market_name: 'CsFloat' | 'Gamerpay' | 'Steam';
    type: string;
    price: number;
    reference: {
        base_price: number;
        float_factor?: number;
        predicted_price: number;
        quantity: number;
        last_updated: string;
    };
    item: {
        asset_id: string;
        paint_index?: number;
        paint_seed?: number;
        float_value?: number;
        icon_url: string;
        is_stattrak?: boolean;
        is_souvenir?: boolean;
        market_hash_name: string;
        inspect_link?: string;
        rarity_name: string;
        type_name: string;
        item_name: string;
        wear_name?: string;
        collection?: string;
    },
    is_seller: boolean;
    min_offer_price?: number;
    max_offer_discount?: number;
};