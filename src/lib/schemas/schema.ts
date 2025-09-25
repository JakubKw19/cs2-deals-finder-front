import {
    getTableConfig,
    integer,
    json,
    PgTable,
    pgTable,
    PgUpdateSetSource,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { Listing } from "../../src/types/listing";
import { getTableColumns, sql } from "drizzle-orm";
import {
    bitskinsPrice,
    buff163Price,
    csfloatPrice,
    csgoempirePrice,
    csgotmPrice,
    csgotraderPrice,
    csmoneyPrice,
    lootfarmPrice,
    skinportPrice,
    steamPrice,
    swapggPrice,
    youpinPrice,
} from "../../src/types/servertypes/marketPrices";

export const UserMessages = pgTable("user_messages", {
    user_id: text("user_id").primaryKey().notNull(),
    createTs: timestamp("create_ts").defaultNow().notNull(),
    message: text("message").notNull(),
});

export const items = pgTable("items", {
    id: integer("id").primaryKey().notNull(),
    type: text("type").notNull(),
    market_hash_name: text("market_hash_name").notNull(),
    min_price: text("min_price"),
    listings: json("listings").$type<Listing[]>().default([]),
});

export function conflictUpdateSetAllColumns<TTable extends PgTable>(
    table: TTable,
): PgUpdateSetSource<TTable> {
    const columns = getTableColumns(table);
    const { name: tableName } = getTableConfig(table);
    const conflictUpdateSet = Object.entries(columns).reduce(
        (acc, [columnName, columnInfo]) => {
            if (!columnInfo.default) {
                // @ts-ignore
                acc[columnName] = sql.raw(
                    `COALESCE(excluded.${columnInfo.name}, ${tableName}.${columnInfo.name})`,
                );
            }
            return acc;
        },
        {},
    ) as PgUpdateSetSource<TTable>;
    return conflictUpdateSet;
}

export const marketPrices = pgTable("market_prices", {
    id: integer("id").primaryKey().notNull(),
    market_hash_name: text("market_hash_name").notNull(),
    steamPrice: json("steam_price").$type<steamPrice>().notNull(),
    buff163Price: json("buff163_price").$type<buff163Price>().notNull(),
    bitskinsPrice: json("bitskins_price").$type<bitskinsPrice>().notNull(),
    skinportPrice: json("skinport_price").$type<skinportPrice>().notNull(),
    lootfarmPrice: json("lootfarm_price").$type<lootfarmPrice>().notNull(),
    csgoempirePrice: json("csgoempire_price")
        .$type<csgoempirePrice>()
        .notNull(),
    youpinPrice: json("youpin_price").$type<youpinPrice>().notNull(),
    csmoneyPrice: json("csmoney_price").$type<csmoneyPrice>().notNull(),
    csfloatPrice: json("csfloat_price").$type<csfloatPrice>().notNull(),
    csgotraderPrice: json("csgotrader_price")
        .$type<csgotraderPrice>()
        .notNull(),
    swapggPrice: json("swapgg_price").$type<swapggPrice>().notNull(),
    csgotmPrice: json("csgotm_price").$type<csgotmPrice>().notNull(),
});

export const globalVariables = pgTable("global_variables", {
    id: integer("id").primaryKey().notNull(),
    currentID: integer("current_ID").notNull(),
});
