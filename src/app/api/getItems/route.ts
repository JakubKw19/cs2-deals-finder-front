import { fetchItems } from "@/scripts/itemData";
import { GeneralItem, ItemsFromFiles } from "@/types/generalItem";
import { NextRequest, NextResponse } from "next/server";

function getApplicableQualities(minFloat: number, maxFloat: number) {
  const qualityRanges = [
    { name: "Factory New", min: 0.0, max: 0.07 },
    { name: "Minimal Wear", min: 0.07, max: 0.15 },
    { name: "Field-Tested", min: 0.15, max: 0.38 },
    { name: "Well-Worn", min: 0.38, max: 0.45 },
    { name: "Battle-Scarred", min: 0.45, max: 1.0 },
  ];

  // Return qualities that overlap with the item's min_float and max_float
  return qualityRanges.filter(
    (quality) => quality.min < maxFloat && quality.max > minFloat
  );
}

export async function GET(req: NextRequest, res: NextResponse) {
  // return handler(req, res);
  const itemParser = await fetchItems();
  if (!itemParser) {
    console.error("Failed to parse items_game.txt");
    return NextResponse.json({
      status: 400,
      body: { error: "Failed to parse items_game.txt" },
    });
  } else {
    const items = itemParser.getFullResponse() as ItemsFromFiles;
    console.log(items);
    let arrOfItems: GeneralItem[] = [];
    let iter = 0;
    Object.keys(items.weapons).forEach((key: string) => {
      Object.keys(items.weapons[key].paints).forEach((paintKey: string) => {
        const minFloat = items.weapons[key].paints[paintKey].min;
        const maxFloat = items.weapons[key].paints[paintKey].max;

        // Get applicable qualities based on item's float range
        const applicableQualities = getApplicableQualities(minFloat, maxFloat);

        // Create items for each applicable quality
        applicableQualities.forEach((quality) => {
          if (items.weapons[key].type === "Weapons") {
            arrOfItems.push({
              id: iter,
              type: items.weapons[key].type,
              market_hash_name: `${items.weapons[key].name} | ${items.weapons[key].paints[paintKey].name} (${quality.name})`,
              min_price: undefined,
              min_float: items.weapons[key].paints[paintKey].min,
              max_float: items.weapons[key].paints[paintKey].max,
              listings: [],
            });
            iter++;
          }
          if (
            items.weapons[key].type === "Gloves" ||
            items.weapons[key].type === "Knives"
          ) {
            arrOfItems.push({
              id: iter,
              type: items.weapons[key].type,
              market_hash_name: `★ ${items.weapons[key].name} | ${items.weapons[key].paints[paintKey].name} (${quality.name})`,
              min_price: undefined,
              min_float: items.weapons[key].paints[paintKey].min,
              max_float: items.weapons[key].paints[paintKey].max,
              listings: [],
            });
            iter++;
          }
          // Increment the ID for each item
        });
      });
    });
    Object.keys(items.stickers).forEach((key: string) => {
      arrOfItems.push({
        id: iter,
        type: "Stickers",
        market_hash_name: items.stickers[key],
        min_price: undefined,
        listings: [],
      });
      iter++;
    });
    Object.keys(items.cases).forEach((key: string) => {
      arrOfItems.push({
        id: iter,
        type: "Cases",
        market_hash_name: items.cases[key].name,
        min_price: undefined,
        listings: [],
      });
      iter++;
    });
    Object.keys(items.capsules).forEach((key: string) => {
      arrOfItems.push({
        id: iter,
        type: "Capsules",
        market_hash_name: items.capsules[key].name,
        min_price: undefined,
        listings: [],
      });
      iter++;
    });

    return NextResponse.json({ status: 200, body: arrOfItems });
  }
}
