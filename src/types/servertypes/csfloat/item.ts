type SellerStatistics = {
  median_trade_time: number;
  total_avoided_trades: number;
  total_failed_trades: number;
  total_trades: number;
  total_verified_trades: number;
};

type Seller = {
  avatar?: string;
  away: boolean;
  flags: number;
  has_valid_steam_api_key: boolean;
  online: boolean;
  stall_public: boolean;
  statistics: SellerStatistics;
  steam_id?: string;
  username?: string;
  verification_mode?: string;
  obfuscated_id?: string; // for auction listings
};

type Reference = {
  base_price: number;
  float_factor?: number;
  predicted_price: number;
  quantity: number;
  last_updated: string;
};

type Item = {
  asset_id: string;
  def_index: number;
  paint_index?: number;
  paint_seed?: number;
  sticker_index?: number;
  float_value?: number;
  icon_url: string;
  d_param?: string;
  is_stattrak?: boolean;
  is_souvenir?: boolean;
  rarity: number;
  quality?: number;
  market_hash_name: string;
  tradable: number;
  inspect_link: string;
  has_screenshot: boolean;
  cs2_screenshot_id?: string;
  cs2_screenshot_at?: string;
  is_commodity: boolean;
  type: string;
  rarity_name: string;
  type_name: string;
  item_name: string;
  wear_name?: string;
  phase?: string;
  high_rank?: number;
  description: string;
  serialized_inspect: string;
  gs_sig: string;
};

type TopBid = {
  id: string;
  created_at: string;
  price: number;
  contract_id: string;
  state: string;
  obfuscated_buyer_id: string;
};

type AuctionDetails = {
  reserve_price: number;
  top_bid: TopBid;
  expires_at: string;
  min_next_bid: number;
};

export type CsfloatListing = {
  id: string;
  created_at: string;
  type: string;
  price: number;
  state: string;
  seller: Seller;
  reference: Reference;
  item: Item;
  is_seller: boolean;
  min_offer_price?: number;
  max_offer_discount?: number;
  is_watchlisted: boolean;
  watchers: number;
  auction_details?: AuctionDetails;
};
