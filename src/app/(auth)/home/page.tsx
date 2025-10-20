"use client";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import ItemTable from "./ItemTable";
import { AppRouter } from "../../../../../backend/src/router";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

type RouterInput = inferRouterInputs<AppRouter>;

type RouterOutput = inferRouterOutputs<AppRouter>;

export type SortedItemsInput = RouterInput["sorting"]["sortPrices"];

export type SortedItemsOutput = RouterOutput["sorting"]["sortPrices"];

// Provide a default object shape to avoid 'void' type issues
const inputKeys = Object.keys({
  min: "",
  max: "",
  nameFilter: "",
  ascending: "",
  liquidity: "",
  type: "",
  tradeLock: "",
  stock: "",
  available: "",
}) as (keyof SortedItemsInput)[];

const types = [
  "sticker",
  "stickerAdded",
  // "buff",
  "csfloat",
  "steam",
  // "steambid",
  "keychain",
  "blue",
  "skinplace",
  "skinplaceBuff",
  "skinplaceAdded",
] as const;

export type FilterType = (typeof types)[number];

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { randomUUID } from "crypto";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

// function TabsComponent({
//   types,
//   data,
//   isLoading,
//   currentType,
//   setCurrentType,
// }: {
//   types: string[];
//   data: SortedItemsOutput;
//   isLoading: boolean;
//   currentType: string;
//   setCurrentType: (type: string) => void;
// }) {
//   return (

//   );
// }

type Tag = {
  id: string;
  text: string;
};

const tags = [
  {
    id: "1",
    text: "Sport",
  },
  {
    id: "2",
    text: "Coding",
  },
  {
    id: "3",
    text: "Travel",
  },
];
export default function Page() {
  const id = useId();
  const [currentType, setCurrentType] = useState<FilterType>("steam");
  // const [currentType, setCurrentType] = useState("csfloat");
  const { data: session, status } = useSession();
  const [searchValue, setSearchValue] = useState("");
  const [currentTagOption, setCurrentTagOption] = useState("Include");
  const [exampleTags, setExampleTags] = useState<Tag[]>(tags);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [minValue, setMinValue] = useState<string | null>("");
  const [maxValue, setMaxValue] = useState<string | null>("");
  const [ascending, setAscending] = useState<"desc" | "asc">("desc");
  const [availability, setAvailability] = useState<string | null>("");
  const [minBuffMultiplyer, setMinBuffMultiplyer] = useState<string | null>("");
  const [minCsfloatMultiplyer, setMinCsfloatMultiplyer] = useState<
    string | null
  >("");
  const [minStock, setMinStock] = useState<string | null>("");
  const [grouping, setGrouping] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const sortedItems = trpc.sorting.sortPrices.useQuery({
    sortBy: currentType,
    min: minValue,
    max: maxValue,
    sortOrder: ascending,
    available: availability,
    stock: minStock,
    page: pagination.pageIndex.toString(),
    grouping: grouping ? "true" : "false",
    minBuffMultiplyer: minBuffMultiplyer,
    minCsfloatMultiplyer: minCsfloatMultiplyer,
  });

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
  }, [currentType]);

  const addActiveTag = (tag: string) => {
    if (!tag) return; // prevent empty tags
    const newTag = { id: crypto.randomUUID(), text: tag };
    setExampleTags((prev) => [...prev, newTag]);
    setSearchValue(""); // clear input
  };

  // If session is loading, you can show a loading indicator
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If there is no session, you might want to handle that case
  if (!session) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const handleSearch = () => {
    // sortedItems.refetch({
    //   type: currentType,
    //   min: minValue || undefined,
    //   max: maxValue || undefined,
    // });
  };

  return (
    <div>
      <div className="flex h-1/6 w-full flex-col justify-between gap-4">
        <div className="flex justify-between">
          <Tabs defaultValue={currentType} className="items-center">
            <TabsList
              id={"1"}
              className="text-foreground shadow-s glass-s gap-2 rounded-sm px-0"
            >
              {types.map((text, index) => (
                <TabsTrigger
                  key={index}
                  value={text}
                  // className="hover:text-foreground data-[state=active]:after:bg-primary relative after:absolute after:inset-x-3 after:bottom-0 after:-mb-1 after:h-0.5"
                  onClick={() => setCurrentType(text)}
                >
                  {text}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Tabs defaultValue={"true"} className="items-center">
            <TabsList
              id={"2"}
              className="text-foreground shadow-s glass-s gap-2 rounded-sm px-0"
            >
              <TabsTrigger
                value={"true"}
                className="px-3"
                // className="hover:text-foreground data-[state=active]:after:bg-primary relative after:absolute after:inset-x-3 after:bottom-0 after:-mb-1 after:h-0.5"
                onClick={() => setAscending("desc")}
              >
                <FaArrowDown />
              </TabsTrigger>
              <TabsTrigger
                value={"false"}
                className="px-3"
                // className="hover:text-foreground data-[state=active]:after:bg-primary relative after:absolute after:inset-x-3 after:bottom-0 after:-mb-1 after:h-0.5"
                onClick={() => setAscending("asc")}
              >
                <FaArrowUp />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex justify-between">
          <div className="flex rounded-md shadow-xs">
            <div className="flex">
              <Select
                defaultValue={currentTagOption}
                onValueChange={(value) => setCurrentTagOption(value)}
              >
                <SelectTrigger className="text-muted-foreground hover:text-foreground w-fit rounded-e-none shadow-none">
                  <SelectValue placeholder={currentTagOption} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Include">Include</SelectItem>
                  <SelectItem value="Exclude">Exclude</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-col"></div>
              <Input
                placeholder="Filter emails..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className="-ms-px rounded-s-none shadow-none focus-visible:z-10"
              />
            </div>
            <Button
              className="ml-2"
              variant="outline"
              onClick={() => addActiveTag(searchValue)}
            >
              Add
            </Button>
          </div>
          <div className="flex gap-4 rounded">
            <div className="group relative">
              <label
                htmlFor={id}
                className="text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
              >
                Min Price
              </label>
              <Input
                id={id}
                placeholder="Value $"
                value={minValue}
                pattern="[0-9]*"
                onChange={(event) => setMinValue(event.target.value)}
                className="!focus:outline-none focus-visible:border-input -ms-px rounded focus:ring-0 focus-visible:z-10 focus-visible:ring-0"
              />
            </div>
            <div className="group relative">
              <label
                htmlFor={id}
                className="text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
              >
                Max Price
              </label>
              <Input
                id={id}
                placeholder="Value $"
                value={maxValue}
                pattern="[0-9]*"
                onChange={(event) => setMaxValue(event.target.value)}
                className="!focus:outline-none focus-visible:border-input -ms-px rounded focus:ring-0 focus-visible:z-10 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="mb-2 flex flex-wrap gap-2 overflow-y-auto">
            {exampleTags.map((tag: Tag, index: number) => (
              <div
                key={tag.id}
                className="bg-card flex items-center gap-1 rounded-full px-3 py-1 text-sm"
              >
                {tag.text}
                <button
                  className="text-xs"
                  onClick={() =>
                    setExampleTags((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-4 rounded">
            <div className="group relative">
              <label
                htmlFor={id}
                className="text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
              >
                Set Minimal Stock
              </label>
              <Input
                id={id}
                placeholder="Value"
                value={minStock}
                pattern="[0-9]*"
                onChange={(event) => setMinStock(event.target.value)}
                className="!focus:outline-none focus-visible:border-input -ms-px rounded focus:ring-0 focus-visible:z-10 focus-visible:ring-0"
              />
            </div>
            <div className="group relative">
              <label
                htmlFor={id}
                className="text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
              >
                Set Minimal Availability
              </label>
              <Input
                id={id}
                placeholder="Value"
                value={availability}
                pattern="[0-9]*"
                onChange={(event) => setAvailability(event.target.value)}
                className="!focus:outline-none focus-visible:border-input -ms-px rounded focus:ring-0 focus-visible:z-10 focus-visible:ring-0"
              />
            </div>
            <div className="group relative">
              <label
                htmlFor={id}
                className="text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
              >
                Min Buff163 Multiplyer
              </label>
              <Input
                id={id}
                placeholder="Value %"
                value={minBuffMultiplyer}
                pattern="[0-9]*"
                onChange={(event) => setMinBuffMultiplyer(event.target.value)}
                className="!focus:outline-none focus-visible:border-input -ms-px rounded focus:ring-0 focus-visible:z-10 focus-visible:ring-0"
              />
            </div>
            <div className="group relative">
              <label
                htmlFor={id}
                className="text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
              >
                Min Csfloat Multiplyer
              </label>
              <Input
                id={id}
                placeholder="Value $"
                value={minCsfloatMultiplyer}
                pattern="[0-9]*"
                onChange={(event) =>
                  setMinCsfloatMultiplyer(event.target.value)
                }
                className="!focus:outline-none focus-visible:border-input -ms-px rounded focus:ring-0 focus-visible:z-10 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
        {/* <div className="flex justify-center">
            <Button onClick={() => handleSearch()}>Search</Button>
          </div> */}
      </div>
      {/* {sortedItems.isLoading ? (
        <div>Loading</div>
      ) : ( */}
      <ItemTable
        data={sortedItems.data}
        isLoading={sortedItems.isLoading}
        filterType={currentType}
        pagination={pagination}
        setPagination={setPagination}
      />
      {/* )} */}
    </div>
  );
}
