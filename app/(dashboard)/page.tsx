'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSWR from 'swr';
import { marketPriceForDB } from '@/types/servertypes/marketPrices';
import { columnsArg } from './columns';
import { DataTable } from './data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { displayedMarketPrice, displayedPreviewPrices } from '@/types/displayedMarketPrice';
import { useEffect, useState } from 'react';
import { marketNames } from '@/lib/variables';
import { Input } from '@/components/ui/input';
// import { ProductsTable } from './products-table';
// import { getProducts } from '@/lib/db';

const fetcher = (url: string) => fetch(url).then((res) => res.json());


export default function ProductsPage({
    searchParams
}: {
    searchParams: { q: string; offset: string };
}) {
    const search = searchParams.q ?? '';
    const offset = searchParams.offset ?? 0;
    // const { products, newOffset, totalProducts } = await getProducts(
    //   search,
    //   Number(offset)
    // );
    const { data, isLoading, error } = useSWR<displayedMarketPrice[]>('/api/allMarket', fetcher, {
        refreshInterval: 300000, // 5 minutes in milliseconds
    });
    const [marketBuyName, setMarketBuyName] = useState('');
    const [marketSellName, setMarketSellName] = useState('');
    const [displayedData, setDisplayedData] = useState<displayedPreviewPrices[]>([]);


    useEffect(() => {
        console.log(marketBuyName, marketSellName);
        if (marketSellName !== '' && marketBuyName !== '') {
            console.log('sorting');
            setDisplayedData((prev) => {
                // Filter out items where marketBuy or marketSell is null
                const filtered = prev.filter((item) => item.marketBuy !== null && item.marketSell !== null);

                const dataAfterAddingDifference = filtered.map((item) => {
                    const marketSell = item.marketSell ?? 0;
                    const marketBuy = item.marketBuy ?? 0;

                    const difference = marketSell - marketBuy;
                    const differencePercent = marketBuy !== 0 ? (difference / marketBuy) * 100 : 0;

                    return {
                        ...item,
                        differencePercent: parseFloat(differencePercent.toFixed(2)),
                        differenceProfit: parseFloat(difference.toFixed(2))
                    };

                });
                // Sort the filtered array
                // const sorted = filtered.sort((a, b) => {
                //     const aDifference = (a.marketSell ?? 0) - (a.marketBuy ?? 0);
                //     const bDifference = (b.marketSell ?? 0) - (b.marketBuy ?? 0);
                //     return bDifference - aDifference; // Sort in descending order
                // });

                const sorted = [...dataAfterAddingDifference].sort((a, b) => {
                    // console.log(a, b);
                    const aDifference = a.differencePercent;
                    const bDifference = b.differencePercent;
                    // Ensure both values are numbers
                    return Number(bDifference) - Number(aDifference); // Sort in descending order
                });

                return sorted; // Return the sorted array
            });
        }
    }, [marketBuyName, marketSellName]);

    const onChangeMarketBuy = (e: string) => {
        setMarketBuyName(e);
        setDisplayedData(
            (prev) => {
                if (data !== undefined) {
                    const newData = data.map((item: displayedMarketPrice) => {
                        return {
                            id: item.id,
                            market_hash_name: item.market_hash_name,
                            marketBuy: typeof item[e as keyof displayedMarketPrice] === 'number' ? item[e as keyof displayedMarketPrice] as number : null,
                            marketSell: prev.find((prevItem) => prevItem.id === item.id)?.marketSell ?? null
                            // marketSell: typeof item[marketSellName as keyof displayedMarketPrice] === 'number' ? item[marketSellName as keyof displayedMarketPrice] as number : null
                        }
                    }
                    ) as displayedPreviewPrices[];
                    return newData;
                } else {
                    return prev;
                }
            }
        );
    }
    const onChangeMarketSell = (e: string) => {
        setMarketSellName(e);
        setDisplayedData(
            (prev) => {
                if (data !== undefined) {
                    const newData = data.map((item: displayedMarketPrice) => {
                        return {
                            id: item.id,
                            market_hash_name: item.market_hash_name,
                            // marketBuy: typeof item[marketBuyName as keyof displayedMarketPrice] === 'number' ? item[marketBuyName as keyof displayedMarketPrice] as number : null,
                            marketBuy: prev.find((prevItem) => prevItem.id === item.id)?.marketBuy ?? null,
                            marketSell: typeof item[e as keyof displayedMarketPrice] === 'number' ? item[e as keyof displayedMarketPrice] as number : null
                        }
                    }
                    ) as displayedPreviewPrices[];
                    return newData;
                } else {
                    return prev;
                }
            }
        );
    }
    return (
        <Tabs defaultValue="all">
            <div className="flex justify-center">
                {/* <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="archived" className="hidden sm:flex">
                        Archived
                    </TabsTrigger>
                </TabsList> */}
                <div className="flex w-1/2">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input type="email" placeholder="Email" />
                        <Button type="submit">Subscribe</Button>
                    </div>
                </div>
                <div className='flex w-1/2 justify-around'>
                    <Select onValueChange={(val) => onChangeMarketBuy(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Market 1" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Object.keys(marketNames).map((name: string) => (
                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))
                            }
                            {/* <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem> */}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(val) => onChangeMarketSell(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Market 2" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Object.keys(marketNames).map((name: string) => (
                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                {/* <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Export
                        </span>
                    </Button>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                        </span>
                    </Button>
                </div> */}
            </div>
            <TabsContent value="all">
                {
                    marketBuyName !== '' && marketSellName !== '' ?
                        isLoading ? <div>Loading...</div> :
                            error ? <div>Error loading products</div> :
                                data &&
                                <div>
                                    <DataTable columns={columnsArg(marketBuyName, marketSellName)} data={displayedData} />

                                </div>
                        : <div>Choose markets</div>
                }
                {/* <ProductsTable
          products={products}
          offset={newOffset ?? 0}
          totalProducts={totalProducts}
        /> */}
            </TabsContent>
        </Tabs>
    );
}
