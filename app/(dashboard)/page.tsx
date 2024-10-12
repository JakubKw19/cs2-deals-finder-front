'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSWR from 'swr';
import { marketPriceForDB } from '@/types/servertypes/marketPrices';
import { columnsArg } from './columns';
import { DataTable } from './data-table';
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
    const { data, isLoading, error } = useSWR<marketPriceForDB[]>('/api/allMarket', fetcher, {
        refreshInterval: 300000, // 5 minutes in milliseconds
    });

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="archived" className="hidden sm:flex">
                        Archived
                    </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
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
                </div>
            </div>
            <TabsContent value="all">
                {
                    isLoading ? <div>Loading...</div> :
                        error ? <div>Error loading products</div> :
                            data &&
                            <div>
                                <DataTable columns={columnsArg("Csfloat", "Buff163")} data={data} />

                            </div>
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
