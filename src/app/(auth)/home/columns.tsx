import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SingleItem } from "./ItemTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { FaSteam } from "react-icons/fa";
import SkinsmonkeyJPG from "@/../public/skinsmonkey.jpg";
import csfloatPNG from "@/../public/csfloat.png";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export const columns: ColumnDef<SingleItem>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected()
  //           ? true
  //           : table.getIsSomePageRowsSelected()
  //             ? "indeterminate"
  //             : false
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    id: "img",
    accessorFn: (row) => row.skinsMonkeyDetails.imageUrl,
    header: "",
    enableGrouping: true,
    aggregatedCell: ({ getValue }) => {
      return (
        <div className="flex w-20 justify-center">
          <img
            className="h-10"
            src={getValue() as string}
            alt={getValue() as string}
          />
        </div>
      );
    },
    aggregationFn: (id, rows) => {
      const first = rows[0];
      return first.getValue("img");
    },
    cell: ({ row }) => {
      if (row.depth > 0) return null;
      return (
        <div className="flex w-20 justify-center">
          <img
            className="h-10"
            src={row.getValue("img")}
            alt={row.getValue("img")}
          />
        </div>
      );
    },
  },
  {
    id: "market_hash_name",
    accessorKey: "market_hash_name",
    header: "Market name",
    enableGrouping: true, // allow grouping
    aggregationFn: undefined, // disable aggregation
    cell: ({ row }) => {
      if (row.depth > 0)
        return (
          <div className="text-muted-foreground flex items-center pl-2 capitalize">
            {row.getValue("market_hash_name")}
          </div>
        );
      return (
        <div className="flex h-12 w-40 items-center overflow-clip pl-2 text-left capitalize">
          {row.getValue("market_hash_name")}
        </div>
      );
    },
  },
  {
    id: "steamDetails.price",
    accessorFn: (row) => row.steamDetails?.price,
    header: "Steam price",
    enableGrouping: true,
    aggregatedCell: ({ getValue }) => {
      return <div className="lowercase">{getValue() as string}</div>;
    },
    aggregationFn: (id, rows) => {
      const amount = parseFloat(
        String(rows[0].getValue("steamDetails.price")).replace(
          /[^0-9.-]+/g,
          "",
        ),
      );
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
    cell: ({ row }) => {
      const amount = parseFloat(
        String(row.getValue("steamDetails.price")).replace(/[^0-9.-]+/g, ""),
      );
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="lowercase">{formatted}</div>;
    },
  },
  {
    id: "buff163price",
    accessorFn: (row) => row.buff163Details?.price,
    header: "Buff price",
    enableGrouping: true,
    aggregatedCell: ({ getValue }) => {
      return <div className="lowercase">{getValue() as string}</div>;
    },
    aggregationFn: (id, rows) => {
      const amount = parseFloat(
        String(rows[0].getValue("buff163price")).replace(/[^0-9.-]+/g, ""),
      );
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
    cell: ({ row }) => {
      const amount = parseFloat(
        String(row.getValue("buff163price")).replace(/[^0-9.-]+/g, ""),
      );
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="lowercase">{formatted}</div>;
    },
  },
  {
    id: "csfloatDetails.price",
    accessorFn: (row) => row.csfloatDetails?.price,
    header: "CsFloat price",
    enableGrouping: true,
    aggregatedCell: ({ getValue }) => {
      return <div className="lowercase">{getValue() as string}</div>;
    },
    aggregationFn: (id, rows) => {
      const amount = parseFloat(
        String(rows[0].getValue("csfloatDetails.price")).replace(
          /[^0-9.-]+/g,
          "",
        ),
      );
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
    cell: ({ row }) => {
      const amount = parseFloat(
        String(row.getValue("csfloatDetails.price")).replace(/[^0-9.-]+/g, ""),
      );
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="lowercase">{formatted}</div>;
    },
  },
  {
    id: "skinsMonkeyDetails.price",
    accessorFn: (row) => row.skinsMonkeyDetails?.price,
    header: "SkinsMonkey price",
    enableGrouping: true,
    aggregatedCell: ({ getValue }) => {
      return <div className="lowercase">{getValue() as string}</div>;
    },
    aggregationFn: (id, rows) => {
      const amount = parseFloat(
        String(rows[0].getValue("skinsMonkeyDetails.price")).replace(
          /[^0-9.-]+/g,
          "",
        ),
      );
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
    cell: ({ row }) => {
      const amount = parseFloat(
        String(row.getValue("skinsMonkeyDetails.price")).replace(
          /[^0-9.-]+/g,
          "",
        ),
      );
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="lowercase">{formatted}</div>;
    },
  },

  {
    id: "steamAskMultiplyer",
    accessorKey: "steamAskMultiplyer",
    enableGrouping: true,
    aggregatedCell: ({ getValue }) => {
      return <div className="lowercase">{getValue() as string}</div>;
    },
    aggregationFn: (id, rows) => {
      const first = rows[0];
      return Number(first.getValue("steamAskMultiplyer")).toPrecision(4);
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Steam
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {Number(row.getValue("steamAskMultiplyer")).toPrecision(4)} %
      </div>
    ),
  },
  {
    id: "csfloatMultiplyer",
    accessorKey: "csfloatMultiplyer",
    enableGrouping: true,
    aggregatedCell: ({ getValue }) => {
      return <div className="lowercase">{getValue() as string}</div>;
    },
    aggregationFn: (id, rows) => {
      const first = rows[0];
      return Number(first.getValue("csfloatMultiplyer")).toPrecision(4);
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="m-0 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Csfloat
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {Number(row.getValue("csfloatMultiplyer")).toPrecision(4)} %
      </div>
    ),
  },
  // {
  //   id: "skinsMonkeyDetails.stickersPrice",
  //   accessorFn: (row) => row.skinsMonkeyDetails?.stickersPrice,
  //   header: "Stickers Price",
  //   enableGrouping: false,
  //   aggregationFn: undefined,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(
  //       row.getValue("skinsMonkeyDetails.stickersPrice"),
  //     );
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);
  //     return <div className="lowercase">{formatted}</div>;
  //   },
  // },
  // {
  //   id: "buffAddedStickerMultiplyer",
  //   accessorKey: "buffAddedStickerMultiplyer",
  //   enableGrouping: false,
  //   aggregationFn: undefined,
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="m-0 p-0"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Added Stck
  //         <ArrowUpDown />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="lowercase">
  //       {Number(row.getValue("buffAddedStickerMultiplyer")).toPrecision(4)} %
  //     </div>
  //   ),
  // },
  {
    id: "overstock",
    accessorFn: (row) => row.skinsMonkeyDetails.overstock,
    header: "Stock",
    enableGrouping: true,
    aggregatedCell: ({ getValue }) => {
      const value = getValue() as { stock: number; limit: number };
      return (
        <div className="lowercase">
          {value.stock}/{value.limit}
        </div>
      );
    },
    aggregationFn: (id, rows) => {
      const first = rows[0];
      console.log(first.getValue("overstock"));
      return first.getValue("overstock");
    },
    cell: ({ row }) => {
      if (row.depth > 0) return null;
      return (
        <div className="lowercase">
          {
            (
              row.getValue("overstock") as {
                limit: number;
                available: number;
                stock: number;
              }
            ).stock
          }
          /
          {
            (
              row.getValue("overstock") as {
                limit: number;
                available: number;
              }
            ).limit
          }
        </div>
      );
    },
  },
  {
    id: "links",
    accessorKey: "links",
    header: "Links",
    enableGrouping: true, // allow grouping
    aggregatedCell: ({ getValue }) => {
      const row = getValue();
      return (
        <div className="flex h-8 w-20 gap-1">
          <a
            href={
              (
                row as {
                  steam: string;
                  skinsmonkey: string;
                  csfloat: string;
                }
              ).steam
            }
            target="_blank"
          >
            <FaSteam className="h-6 w-6" />
          </a>
          <a
            href={
              (
                row as {
                  steam: string;
                  skinsmonkey: string;
                  csfloat: string;
                }
              ).skinsmonkey
            }
            target="_blank"
          >
            <img
              className="h-6 w-6 rounded-full"
              src={SkinsmonkeyJPG.src}
              alt="skinsmoneky"
            />
          </a>
          <a
            href={
              (
                row as {
                  steam: string;
                  skinsmonkey: string;
                  csfloat: string;
                }
              ).csfloat
            }
            target="_blank"
          >
            <img
              className="h-6 w-6 rounded-full"
              src={csfloatPNG.src}
              alt="csfloat"
            />
          </a>
        </div>
      );
    },
    aggregationFn: (id, rows) => {
      const first = rows[0];
      console.log(first.getValue("links"));
      return first.getValue("links");
    },
    cell: ({ row }) => {
      if (row.depth > 0) return null;
      return (
        <div className="flex h-6 w-20 gap-1">
          <a
            href={
              (
                row.getValue("links") as {
                  steam: string;
                  skinsmonkey: string;
                  csfloat: string;
                }
              ).steam
            }
            target="_blank"
          >
            <FaSteam className="h-6 w-6" />
          </a>
          <a
            href={
              (
                row.getValue("links") as {
                  steam: string;
                  skinsmonkey: string;
                  csfloat: string;
                }
              ).skinsmonkey
            }
            target="_blank"
          >
            <img
              className="h-6 w-6 rounded-full"
              src={SkinsmonkeyJPG.src}
              alt="skinsmoneky"
            />
          </a>
          <a
            href={
              (
                row.getValue("links") as {
                  steam: string;
                  skinsmonkey: string;
                  csfloat: string;
                }
              ).csfloat
            }
            target="_blank"
          >
            <img
              className="h-6 w-6 rounded-full"
              src={csfloatPNG.src}
              alt="csfloat"
            />
          </a>
        </div>
      );
    },
  },
  {
    id: "actions",
    // enableHiding: false,
    enableGrouping: true, // allow grouping
    aggregationFn: undefined, // disable aggregation
    cell: ({ row }) => {
      const payment = row.original;
      if (row.depth > 0) return null;
      if (!row.getIsGrouped()) return null;
      return (
        // <Button
        //   variant="ghost"
        //   className="m-0 p-0"
        //   onClick={() => row.toggleExpanded()}
        // >
        row.getIsExpanded() ? <IoIosArrowUp /> : <IoIosArrowDown />
        // </Button>
      );
      // return (
      //   <DropdownMenu>
      //     <DropdownMenuTrigger asChild>
      //       <Button variant="ghost" className="h-8 w-8 p-0">
      //         <span className="sr-only">Open menu</span>
      //         <MoreHorizontal />
      //       </Button>
      //     </DropdownMenuTrigger>
      //     <DropdownMenuContent align="end">
      //       <DropdownMenuLabel>Actions</DropdownMenuLabel>
      //       {/* <DropdownMenuItem
      //         onClick={() => navigator.clipboard.writeText(payment.id)}
      //       >
      //         Copy payment ID
      //       </DropdownMenuItem> */}
      //       <DropdownMenuSeparator />
      //       <DropdownMenuItem>View customer</DropdownMenuItem>
      //       <DropdownMenuItem>View payment details</DropdownMenuItem>
      //     </DropdownMenuContent>
      //   </DropdownMenu>
      // );
    },
  },
];
