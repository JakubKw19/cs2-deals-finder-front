"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.



export const columnsArg = (marketBuyName: string, marketSellName: string) => {
    return [
        {
            accessorKey: "id",
            header: "Id",
        },
        {
            accessorKey: "market_hash_name",
            header: "Name",
        },
        {
            accessorKey: "marketBuy",
            header: marketBuyName,
        },
        {
            accessorKey: "marketSell",
            header: marketSellName,
        },
    ]
}


// export const columns: ColumnDef<marketType>[] = [
//     {
//         accessorKey: "id",
//         header: "Id",
//     },
//     {
//         accessorKey: "market_hash_name",
//         header: "Name",
//     },
//     {
//         accessorKey: "marketBuy",
//         header: "Buff163 price",
//     },
//     {
//         accessorKey: "marketSell",
//         header: "Buff163 price",
//     },
// ]
