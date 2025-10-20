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
import { FilterType, SortedItemsOutput } from "./page";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaSteam } from "react-icons/fa";

import { getGroupedRowModel } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { config, useColumnData } from "./useColumnData";

export type SingleItem = SortedItemsOutput["items"][number];

const columnConfig: config = {
  market_hash_name: {
    grouping: true,
    type: "name",
    displayName: "Item Name",
  },
  img: {
    grouping: false,
    type: "img",
    displayName: "Image",
    accessorFn: (row: SingleItem) => row.skinsMonkeyDetails?.imageUrl,
  },
  steam: {
    grouping: true,
    type: "currency",
    displayName: "Steam price",
    accessorFn: (row: SingleItem) => row.steamDetails?.price,
  },
  buffPrice: {
    grouping: true,
    type: "currency",
    displayName: "Buff163 Price",
    accessorFn: (row: SingleItem) => row.buff163Details.price,
  },
  csfloatPrice: {
    grouping: true,
    type: "currency",
    displayName: "CSFloat Price",
    accessorFn: (row: SingleItem) => row.csfloatDetails.price,
  },
  skinsmonkeyPrice: {
    grouping: true,
    type: "currency",
    displayName: "SkinsMonkey Price",
    accessorFn: (row: SingleItem) => row.skinsMonkeyDetails?.price,
  },
  steamMultiplyer: {
    grouping: true,
    type: "multiplyer",
    displayName: "Steam",
    accessorFn: (row: SingleItem) => row.steamMultiplyer,
  },
  steamAskMulitplyer: {
    grouping: true,
    type: "multiplyer",
    displayName: "Steam",
    accessorFn: (row: SingleItem) => row.steamAskMultiplyer,
  },
  csfloat: {
    grouping: true,
    type: "multiplyer",
    displayName: "CSFloat",
    accessorFn: (row: SingleItem) => row.csfloatMultiplyer,
  },
  buffMulitplyer: {
    grouping: true,
    type: "multiplyer",
    displayName: "Buff163",
    accessorFn: (row: SingleItem) => row.buffMultiplyer,
  },
  buffAdded: {
    grouping: true,
    type: "multiplyer",
    displayName: "Buff163 Added",
    accessorFn: (row: SingleItem) => row.buffAddedStickerMultiplyer,
  },
  sticker: {
    grouping: false,
    type: "currency",
    displayName: "Sticker Price",
    accessorFn: (row: SingleItem) => row.skinsMonkeyDetails?.stickersPrice,
    condition: ["stickerAdded", "sticker"],
  },
  stickerAdded: {
    grouping: false,
    type: "multiplyer",
    displayName: "Sticker Added",
    accessorFn: (row: SingleItem) => row.buffAddedStickerMultiplyer,
    condition: ["stickerAdded", "sticker"],
  },
  blue: {
    grouping: false,
    type: "multiplyer",
    displayName: "Blue %",
    accessorFn: (row: SingleItem) =>
      row.skinsMonkeyDetails?.bluePercent
        ? row.skinsMonkeyDetails?.bluePercent[0]
        : undefined,
    condition: ["blue"],
  },
  keychain: {
    grouping: false,
    condition: ["keychain"],
    type: "currency",
    displayName: "Keychain",
    accessorFn: (row: SingleItem) => row.skinsMonkeyDetails?.keychainsPrice,
  },
  skinplace: {
    grouping: false,
    condition: ["skinplace", "skinplaceBuff", "skinplaceAdded"],
    type: "multiplyer",
    displayName: "Skinplace",
    accessorFn: (row: SingleItem) => row.skinplaceMultiplyer,
  },
  skinplaceBuff: {
    grouping: true,
    condition: ["skinplace", "skinplaceBuff", "skinplaceAdded"],
    type: "multiplyer",
    displayName: "SkinplaceBuff",
    accessorFn: (row: SingleItem) => row.skinplaceBuffMulitplyer,
  },
  skinplaceAdded: {
    grouping: false,
    condition: ["skinplace", "skinplaceBuff", "skinplaceAdded"],
    type: "multiplyer",
    displayName: "SkinplaceAdded",
    accessorFn: (row: SingleItem) => row.skinplaceAddedStickerMultiplyer,
  },
  stock: {
    grouping: false,
    type: "stock",
    displayName: "Stock",
  },
  links: {
    grouping: false,
    type: "links",
    displayName: "Links",
    accessorFn: (row: SingleItem) => row.links,
  },
};

import type { PaginationState } from "@tanstack/react-table";

export default function ItemTable({
  data,
  isLoading,
  filterType,
  pagination,
  setPagination,
}: {
  data: SortedItemsOutput;
  isLoading: boolean;
  filterType: FilterType;
  pagination: PaginationState;
  setPagination: (
    updater: PaginationState | ((old: PaginationState) => PaginationState),
  ) => void;
}) {
  const id = React.useId();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const currentConfig = columnConfig[filterType];
  const [grouping, setGrouping] = React.useState<string[]>(
    currentConfig.grouping ? ["market_hash_name"] : [],
  );

  useEffect(() => {
    console.log(currentConfig);
    if (currentConfig.grouping) {
      setGrouping(["market_hash_name"]);
    } else {
      setGrouping([]);
    }
  }, [filterType]);

  const togleGrouping = () => {
    if (grouping.length === 0) {
      setGrouping(["market_hash_name"]);
    } else {
      setGrouping([]);
    }
  };

  const columnsData = useColumnData(columnConfig, filterType);

  const tableData = React.useMemo(
    () => (isLoading ? null : data.items),
    [isLoading, data],
  );
  const tableColumns = React.useMemo<ColumnDef<SingleItem>[]>(
    () => (isLoading ? [] : columnsData),
    [isLoading],
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    // columns: columns,
    manualPagination: true,
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
    paginateExpandedRows: false,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      grouping,
    },
    onPaginationChange: setPagination,
  });

  // table.setGrouping(["market_hash_name"]);

  {
    /* {row.getIsExpanded()
                            ? table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                  {headerGroup.headers.map((header) => {
                                    return (
                                      <TableCell key={header.id}>
                                        {header.isPlaceholder
                                          ? null
                                          : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                            )}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              ))
                            : null} */
  }
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center">
        <div className="border-input has-data-[state=checked]:border-primary/50 relative flex items-start gap-2 rounded border p-4 shadow-xs outline-none">
          <Switch
            id={id}
            className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
            aria-describedby={`${id}-description`}
            onClick={togleGrouping}
            checked={grouping.length > 0}
            // defaultChecked={currentConfig.grouping}
            disabled={!currentConfig.grouping}
          />
          <div className="grid grow gap-2">
            <Label htmlFor={id}>Grouping</Label>
            {/* <p
              id={`${id}-description`}
              className="text-muted-foreground text-xs"
            >
              A short description goes here.
            </p> */}
          </div>
        </div>
        <DropdownMenu>
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
        </DropdownMenu>
      </div>
      <div>
        <div className="overflow-y-auto rounded-md border">
          <Table className="shadow-m relative">
            <TableHeader className="glass-s sticky top-0 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isGrouped = table
                      .getState()
                      .grouping.includes(header.column.id);
                    // if (
                    //   [
                    //     "buffAddedStickerMultiplyer",
                    //     "skinsMonkeyDetails.stickersPrice",
                    //   ].includes(header.column.id) &&
                    //   grouping.length > 0
                    // )
                    //   return null;
                    // if (isGrouped) return null;
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
                    colSpan={columnsData.length}
                    className="h-full w-full text-center"
                  >
                    Loading
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody className="glass">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const isGroupedRow = row.getIsGrouped();
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
                              // if (
                              //   [
                              //     "buffAddedStickerMultiplyer",
                              //     "skinsMonkeyDetails.stickersPrice",
                              //   ].includes(columnId)
                              // )
                              //   return null;
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
                                    "skinsMonkeyDetails.stickersPrice",
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
                      colSpan={columnsData.length}
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
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex - 1,
                  }))
                }
                disabled={pagination.pageIndex < 2}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex + 1,
                  }))
                }
                disabled={
                  (pagination.pageIndex + 1) * data.pageSize >= data.total
                }
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
