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

import { getGroupedRowModel } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { columns as baseColumns } from "./columns";
import { useEffect } from "react";

export type SingleItem = SortedItemsOutput[number];

const config: {
  [key: string]: { grouping: boolean; addedColumns?: string[] };
} = {
  sticker: {
    grouping: false,
  },
  blue: {
    grouping: false,
    addedColumns: ["blue"],
  },
  stickerAdded: {
    grouping: false,
  },
  csfloat: {
    grouping: true,
  },
  buff: {
    grouping: true,
  },
  steam: {
    grouping: true,
  },
  steambid: {
    grouping: true,
  },
  keychain: {
    grouping: false,
    addedColumns: ["keychain"],
  },
};

export default function ItemTable({
  data,
  isLoading,
  filterType,
}: {
  data: SortedItemsOutput;
  isLoading: boolean;
  filterType: keyof typeof config;
}) {
  const id = React.useId();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const currentConfig = config[filterType];
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

  const columns = React.useMemo(() => {
    const newColumns = [...baseColumns];
    if (filterType == "blue") {
      const blueColumn: ColumnDef<SingleItem> = {
        id: "blue",
        accessorFn: (row) =>
          row.skinsMonkeyDetails?.bluePercent
            ? row.skinsMonkeyDetails?.bluePercent[0]
            : "", // Accessor for the data
        header: "Blue %",
        cell: ({ getValue }) => {
          if (!getValue()) return "N/A";
          return Number(getValue()).toPrecision(4) + "%";
        },
      };
      const nameIndex = newColumns.findIndex(
        (c) => c.id === "buffAddedStickerMultiplyer",
      );
      if (nameIndex !== -1) {
        newColumns.splice(nameIndex + 1, 0, blueColumn);
      } else {
        newColumns.push(blueColumn); // Fallback to add at the end
      }
    } else if (filterType == "keychain") {
      const blueColumn: ColumnDef<SingleItem> = {
        id: "blue",
        accessorFn: (row) => row.skinsMonkeyDetails?.keychainsPrice, // Accessor for the data
        header: "Keychain",
        cell: ({ getValue }) => {
          if (!getValue()) return "N/A";
          const formatted = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "USD",
          }).format(Number(getValue()));
          return formatted;
        },
      };
      const nameIndex = newColumns.findIndex(
        (c) => c.id === "buffAddedStickerMultiplyer",
      );
      if (nameIndex !== -1) {
        newColumns.splice(nameIndex + 1, 0, blueColumn);
      } else {
        newColumns.push(blueColumn); // Fallback to add at the end
      }
    }

    return newColumns;
  }, [filterType]);

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
    paginateExpandedRows: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      grouping,
    },
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
                    colSpan={columns.length}
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
