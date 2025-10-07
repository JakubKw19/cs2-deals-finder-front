"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortedItemsOutput } from "./page";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaSteam } from "react-icons/fa";
import SkinsmonkeyJPG from "@/../public/skinsmonkey.jpg";
import csfloatPNG from "@/../public/csfloat.png";
import { getGroupedRowModel } from "@tanstack/react-table";

type SingleItem = SortedItemsOutput[number];

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
          <div className="text-muted pl-5 capitalize">
            {row.getValue("market_hash_name")}
          </div>
        );
      return (
        <div className="pl-2 text-left capitalize">
          {row.getValue("market_hash_name")}
        </div>
      );
    },
  },
  {
    id: "steamDetails.price",
    accessorFn: (row) => row.steamDetails?.price,
    header: "Steam price",
    enableGrouping: true, // allow grouping
    aggregationFn: undefined, // disable aggregation
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("steamDetails.price"));
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("de-DE", {
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
    enableGrouping: true, // allow grouping
    aggregationFn: undefined, // disable aggregation
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("csfloatDetails.price"));
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("de-DE", {
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
    enableGrouping: true, // allow grouping
    aggregationFn: undefined, // disable aggregation
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("skinsMonkeyDetails.price"));
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="lowercase">{formatted}</div>;
    },
  },
  {
    id: "skinsMonkeyDetails.stickersPrice",
    accessorFn: (row) => row.skinsMonkeyDetails?.stickersPrice,
    header: "Stickers Price",
    enableGrouping: false,
    aggregationFn: undefined,
    cell: ({ row }) => {
      const amount = parseFloat(
        row.getValue("skinsMonkeyDetails.stickersPrice"),
      );
      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="lowercase">{formatted}</div>;
    },
  },
  {
    id: "steamMultiplyer",
    accessorKey: "steamMultiplyer",
    enableGrouping: true, // allow grouping
    aggregationFn: undefined, // disable aggregation
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
        {Number(row.getValue("steamMultiplyer")).toPrecision(4)} %
      </div>
    ),
  },
  {
    id: "csfloatMultiplyer",
    accessorKey: "csfloatMultiplyer",
    enableGrouping: true, // allow grouping
    aggregationFn: undefined, // disable aggregation
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
  {
    id: "buffAddedStickerMultiplyer",
    accessorKey: "buffAddedStickerMultiplyer",
    enableGrouping: false,
    aggregationFn: undefined,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="m-0 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Added Stck
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {Number(row.getValue("buffAddedStickerMultiplyer")).toPrecision(4)} %
      </div>
    ),
  },
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
    aggregationFn: undefined, // disable aggregation
    accessorFn: (row) => row.links,
    cell: ({ row }) => {
      const isGrouped = row.getIsGrouped();
      // if (isGrouped) {
      //   return <div>-</div>;
      // }
      return (
        <div className="flex h-10 w-25 gap-1">
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
            <FaSteam className="h-8 w-8" />
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
              className="h-8 w-8 rounded-full"
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
              className="h-8 w-8 rounded-full"
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

export default function ItemTable({
  data,
  isLoading,
}: {
  data: SortedItemsOutput;
  isLoading: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [grouping, setGrouping] = React.useState<string[]>([
    "market_hash_name",
  ]);

  const table = useReactTable({
    data,
    columns,
    onGroupingChange: setGrouping,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      grouping,
    },
  });

  // table.setGrouping(["market_hash_name"]);
  return (
    <div className="h-5/6 w-full">
      <div className="mb-2 flex items-center">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="h-full">
        <div className="h-9/10 overflow-y-auto rounded-md border">
          <Table className="shadow-m relative h-full w-full">
            <TableHeader className="glass-s sticky top-0 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            {isLoading ? (
              <TableBody className="glass h-full">
                <TableRow className="h-full">
                  <TableCell
                    colSpan={columns.length}
                    className="h-full w-full text-center"
                  >
                    Loading
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              // <div className="h-full w-full overflow-y-auto">
              <TableBody className="glass">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const isGroupedRow = row.getIsGrouped();
                    const groupedColumnIds = table.getState().grouping;
                    const groupedCellCount = row
                      .getVisibleCells()
                      .filter((cell) => cell.getIsGrouped()).length;
                    return (
                      <React.Fragment key={row.id}>
                        <TableRow
                          data-state={row.getIsSelected() && "selected"}
                          onClick={() => !isGroupedRow && row.toggleExpanded()}
                        >
                          {row.getVisibleCells().map((cell) => {
                            const groupingColumnId =
                              table.getState().grouping[0];
                            const isGroupedHeaderCell =
                              table
                                .getState()
                                .grouping.includes(cell.column.id) &&
                              row.getIsGrouped();
                            if (isGroupedHeaderCell) {
                              return (
                                <TableCell
                                  key={cell.id}
                                  className="max-h-18 p-2 text-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    row.toggleExpanded();
                                  }}
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                  )}
                                </TableCell>
                              );
                            } else if (isGroupedRow) {
                              const columnId = cell.column.id;
                              return (
                                <TableCell
                                  key={cell.id}
                                  className="max-h-18 p-2 text-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    row.toggleExpanded();
                                  }}
                                >
                                  {![
                                    "buffAddedStickerMultiplyer",
                                    "links",
                                  ].includes(columnId)
                                    ? flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                      )
                                    : null}
                                </TableCell>
                              );
                            }
                            if (isGroupedRow) {
                              return null;
                            }
                            return (
                              <TableCell
                                key={cell.id}
                                className="max-h-18 p-1 text-center"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </React.Fragment>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              // </div>
            )}
          </Table>
        </div>
        {isLoading ? null : (
          <div className="flex h-1/10 items-center justify-end space-x-2 py-4">
            {/* <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div> */}
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
