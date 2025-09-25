import { Listing } from "./listing";

export type ItemsFromFiles = {
  weapons: {
    [key: string]: {
      name: string;
      type: string;
      stickerAmount: number;
      paints: {
        [key: string]: {
          name: string;
          min: number;
          max: number;
        };
      };
    };
  };
  stickers: {
    [key: string]: string;
  };
  cases: {
    [key: string]: {
      name: string;
    };
  };
  capsules: {
    [key: string]: {
      name: string;
    };
  };
};

export type GeneralItem =
  | {
      id: number;
      type: "Weapons";
      market_hash_name: string;
      min_price: number | undefined;
      min_float: number;
      max_float: number;
      listings: Listing[];
      souvenirListings?: Listing[];
      stattrackListings?: Listing[];
    }
  | {
      id: number;
      type: "Knives";
      market_hash_name: string;
      min_price: number | undefined;
      min_float: number;
      max_float: number;
      listings: Listing[];
      stattrackListings?: Listing[];
    }
  | {
      id: number;
      type: "Gloves";
      market_hash_name: string;
      min_price: number | undefined;
      min_float: number;
      max_float: number;
      listings: Listing[];
    }
  | {
      id: number;
      type: "Stickers" | "Capsules" | "Cases";
      market_hash_name: string;
      min_price: number | undefined;
      listings: Listing[];
    };
