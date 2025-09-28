"use client";
import { useSession } from "next-auth/react";
import ItemTable from "./ItemTable";
import { trpc } from "@/utils/trpc";

export default function Page() {
  const sortedItems = trpc.sorting.sortPrices.useQuery({ type: "blue" });
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
      <ItemTable />
      {sortedItems.isLoading && <p>Loading prices...</p>}
      {sortedItems.error && <p>Error: {sortedItems.error.message}</p>}
      {sortedItems && <pre>{JSON.stringify(sortedItems, null, 2)}</pre>}
    </div>
  );
}
