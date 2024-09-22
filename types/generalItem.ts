import { Listing } from "./listing";

export type GeneralItem = {
    id: number;
    market_hash_name: string;
    min_price: number;
    listings: Listing[];
}