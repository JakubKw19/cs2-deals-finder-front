"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
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
    cell: ({ row }) => {
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
    accessorKey: "market_hash_name",
    header: "Market name",
    cell: ({ row }) => (
      <div className="text-left capitalize">
        {row.getValue("market_hash_name")}
      </div>
    ),
  },
  {
    id: "steamDetails.price",
    accessorFn: (row) => row.steamDetails?.price,
    header: "Steam price",
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
    accessorKey: "steamMultiplyer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          steamMultiplyer
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {Number(row.getValue("steamMultiplyer")).toPrecision(4)}
      </div>
    ),
  },
  {
    accessorKey: "csfloatMultiplyer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="m-0 p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          csfloatMultiplyer
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {Number(row.getValue("csfloatMultiplyer")).toPrecision(4)}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
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

export default function ItemTable({ data }: { data: SortedItemsOutput }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
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
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => row.toggleExpanded()}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4 text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      {/* The second row's cell must span the full width of the table
                  using colSpan.
                */}
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <div className="bg-gray-50 p-4 dark:bg-gray-800">
                          {/* Replace with your actual row details */}
                          <h4 className="mb-2 font-semibold">
                            Details for Row {row.id}
                          </h4>
                          <p>
                            This is the full-width content that expands and
                            collapses with the main row.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
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
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
    </div>
  );
}
