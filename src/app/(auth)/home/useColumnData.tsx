import { ColumnDef } from "@tanstack/react-table";
import { SingleItem } from "./ItemTable";
import { FaSteam } from "react-icons/fa";
import SkinsmonkeyJPG from "@/../public/skinsmonkey.jpg";
import csfloatPNG from "@/../public/csfloat.png";
import { JSX } from "react";
import { FilterType } from "./page";

type columnTypes =
  | "currency"
  | "name"
  | "img"
  | "links"
  | "multiplyer"
  | "stock";

export type config = {
  [key: string]: {
    grouping: boolean;
    type: columnTypes;
    displayName: string;
    accessorFn?: (row: SingleItem) => any | undefined;
    condition?: FilterType[];
  };
};

const columnStrategies = {
  name: (
    id: string,
    header: ({ column }: any) => JSX.Element,
    grouping: boolean,
  ): ColumnDef<SingleItem> => {
    return {
      id,
      header,
      accessorKey: id,
      enableGrouping: grouping,
      cell: ({ row }) => {
        if (row.depth > 0)
          return (
            <div className="flex h-12 items-center overflow-clip pl-2 text-left capitalize">
              {row.getValue(id)}
            </div>
          );
        return (
          <div className="flex h-12 items-center overflow-clip pl-2 text-left capitalize">
            {row.getValue(id)}
          </div>
        );
      },
    };
  },
  currency: (
    id: string,
    accessorFn: (row: SingleItem) => any | undefined,
    header: ({ column }: any) => JSX.Element,
    grouping: boolean,
  ): ColumnDef<SingleItem> => {
    return {
      id,
      accessorFn,
      header,
      enableGrouping: grouping,
      aggregatedCell: ({ getValue }) => {
        if (!grouping) return null;
        return <div className="lowercase">{getValue() as string}</div>;
      },
      aggregationFn: (id, rows) => {
        if (!grouping) return null;
        const amount = parseFloat(
          String(rows[0].getValue(id)).replace(/[^0-9.-]+/g, ""),
        );
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return formatted;
      },
      cell: ({ row }) => {
        console.log(row);
        const amount = parseFloat(
          String(row.getValue(id)).replace(/[^0-9.-]+/g, ""),
        );
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="lowercase">{formatted}</div>;
      },
    };
  },
  img: (
    id: string,
    accessorFn: (row: SingleItem) => number | string | undefined,
    header: ({ column }: any) => JSX.Element,
    grouping: boolean,
  ): ColumnDef<SingleItem> => {
    return {
      id,
      accessorFn,
      header,
      enableGrouping: grouping,
      aggregatedCell: ({ getValue }) => {
        return (
          <div className="flex justify-center">
            <img
              className="h-12"
              src={getValue() as string}
              alt={getValue() as string}
            />
          </div>
        );
      },
      aggregationFn: (id, rows) => {
        const first = rows[0];
        return first.getValue(id);
      },
      cell: ({ row }) => {
        if (row.depth > 0) return null;
        return (
          <div className="flex justify-center">
            <img
              className="h-12"
              src={row.getValue(id)}
              alt={row.getValue(id)}
            />
          </div>
        );
      },
    };
  },
  multiplyer: (
    id: string,
    accessorFn: (row: SingleItem) => number | string | undefined,
    header: ({ column }: any) => JSX.Element,
    grouping: boolean,
  ): ColumnDef<SingleItem> => {
    return {
      id,
      accessorFn,
      header,
      enableGrouping: grouping,
      aggregatedCell: ({ getValue }) => {
        if (!grouping) return null;
        return <div className="lowercase">{getValue() as string} %</div>;
      },
      aggregationFn: (id, rows) => {
        if (!grouping) return null;
        const amount = parseFloat(
          String(rows[0].getValue(id)).replace(/[^0-9.-]+/g, ""),
        );
        const formatted = amount.toFixed(2);
        return formatted;
      },
      cell: ({ row }) => {
        const amount = parseFloat(
          String(row.getValue(id)).replace(/[^0-9.-]+/g, ""),
        );
        const formatted = amount.toFixed(2);
        return <div className="lowercase">{formatted} %</div>;
      },
    };
  },
  stock: () => {
    return {
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
    };
  },
  links: () => {
    return {
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
    };
  },
};

export function useColumnData(
  config: config,
  filterType: FilterType,
): ColumnDef<SingleItem>[] {
  const columns = Object.keys(config).map((key) => {
    const columnConfig = config[key];
    const header = function () {
      return (
        <div className="flex justify-center">{columnConfig.displayName}</div>
      );
    };
    if (columnConfig.condition) {
      if (!columnConfig.condition.includes(filterType)) {
        return null;
      }
    }
    switch (columnConfig.type) {
      case "name":
        return columnStrategies.name(key, header, columnConfig.grouping);
      case "currency":
        return columnStrategies.currency(
          key,
          columnConfig.accessorFn,
          header,
          columnConfig.grouping,
        );
      case "img":
        return columnStrategies.img(
          key,
          columnConfig.accessorFn,
          header,
          columnConfig.grouping,
        );
      case "multiplyer":
        return columnStrategies.multiplyer(
          key,
          columnConfig.accessorFn,
          header,
          columnConfig.grouping,
        );
      case "stock":
        return columnStrategies.stock();
      case "links":
        return columnStrategies.links();
      default:
        throw new Error(`Unknown column type: ${columnConfig.type}`);
    }
  });
  return columns.filter((col): col is ColumnDef<SingleItem> => col !== null);
}
