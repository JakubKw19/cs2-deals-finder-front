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
  "csfloat",
  "buff",
  "steam",
  "steambid",
  "keychain",
  "blue",
];

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

function TabsComponent({
  data,
  currentType,
  setCurrentType,
}: {
  data: string[];
  currentType: string;
  setCurrentType: (type: string) => void;
}) {
  return (
    <Tabs defaultValue={currentType} className="items-center">
      <TabsList className="text-foreground h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">
        {data.map((text, index) => (
          <TabsTrigger
            key={index}
            value={text}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            onClick={() => setCurrentType(text)}
          >
            {text}
          </TabsTrigger>
        ))}

        {/* <TabsTrigger
          value="tab-2"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Tab 2
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Tab 3
        </TabsTrigger> */}
      </TabsList>
      {/* <TabsContent value="tab-1">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 1
        </p>
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 2
        </p>
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 3
        </p>
      </TabsContent> */}
    </Tabs>
  );
}

export default function Page() {
  const [currentType, setCurrentType] = useState("csfloat");
  const sortedItems = trpc.sorting.sortPrices.useQuery({ type: currentType });
  const { data: session, status } = useSession();

  // If session is loading, you can show a loading indicator
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If there is no session, you might want to handle that case
  if (!session) {
    return <div>Please log in to view your dashboard.</div>;
  }

  console.log(session);
  // Assuming your session contains the account data
  // const accountData = {
  //     avatarfull: session.picture, // Assuming picture is stored in session
  //     personaname: session.user.name,    // Assuming name is stored in session
  //     steamid: session.id,                // Assuming Steam ID is stored in session
  // };

  return (
    <div>
      <TabsComponent
        data={types}
        currentType={currentType}
        setCurrentType={setCurrentType}
      />
      {sortedItems.isLoading && <p>Loading prices...</p>}
      {sortedItems.error && <p>Error: {sortedItems.error.message}</p>}
      {sortedItems.data && (
        <ItemTable data={sortedItems.data} />
        // <pre>{JSON.stringify(sortedItems.data, null, 2)}</pre>
      )}
    </div>
  );
}
