import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query';
import {useCallback, useMemo } from 'react'
import { convertToUTCDate, formatCurrencyValue } from '@/lib/helpers';
import {
    Card,
    CardHeader,
    CardTitle
} from "@/components/ui/card"  
import { getCategoryStatsResponseType } from '../api/category-statistics/route';
import { Transaction } from '@/types/types';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ICategoryStatisticsCardsProps {
    userSettings: UserSettings;
    from: Date;
    to: Date;
}

function CategoryStatisticsCards({userSettings, from, to}:ICategoryStatisticsCardsProps) {
    const stats = useQuery<getCategoryStatsResponseType>({
        queryKey: ['overview', 'stats', 'category', from, to],
        queryFn: async () => {
            const response = await fetch(`/api/category-statistics?from=${convertToUTCDate(from)}&to=${convertToUTCDate(to)}`);
            if (!response.ok) {
                throw new Error('Something went wrong while fetching your statistics.');
            }
            const data = response.json();
            return data;
        },
    });

    const currencyFormatter = useMemo(() => {
        return formatCurrencyValue(userSettings.currency);
    }, [userSettings.currency]);

    return (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 md:flex-nowrap">
            <CategoryCard 
            type="income"
            data={stats.data || []}
            currencyFormatter={currencyFormatter}
            />
            <CategoryCard 
            type="expense"
            data={stats.data || []}
            currencyFormatter={currencyFormatter}
            />
        </div>
    )
}

export default CategoryStatisticsCards

interface IStatisticsCardProps {
    type: Transaction;
    data: getCategoryStatsResponseType;
    currencyFormatter: Intl.NumberFormat;
}

function CategoryCard({type, data, currencyFormatter}:IStatisticsCardProps) {
    const formatFn = useCallback((value: number) => {
        return currencyFormatter.format(value);
    }, [currencyFormatter]);

    const filteredByCategory = data.filter((category) => category.type === type);
    const total = filteredByCategory.reduce((acc, curr) => acc + (curr._sum.amount || 0),0);

    return (
        <Card className="w-full h-80 col-span-6">
            <CardHeader>
                <CardTitle>{type === "income" ? "Incomes" : "Expenses"}</CardTitle>
            </CardHeader>
            <div className="flex items-center justify-between gap-2">
                {
                    filteredByCategory.length === 0 && (
                        <div className="h-60 flex flex-col items-center justify-center">
                            No data found for the selected time period
                            <p className="text-sm text-muted-foreground">Try selecting different date or by adding {type === "income" ? "incomes" : "expenses"}</p>
                        </div>
                    )
                }
                {
                        filteredByCategory.length > 0 && (
                        <ScrollArea className="h-60 w-full px-4">
                            <div className="flex w-full flex-col gap-4 p-4">
                            {filteredByCategory.map((item) => {
                                const amount = item._sum.amount || 0;
                                const percentage = (amount * 100) / (total || amount);

                                return (
                                <div key={item.category} className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center text-gray-400">
                                            {item.categoryIcon} {item.category}
                                            <span className="ml-2 text-xs text-muted-foreground">
                                            ({percentage.toFixed(0)}%)
                                            </span>
                                        </span>

                                        <span className="text-sm text-gray-400">
                                            {formatFn(amount)}
                                        </span>
                                        </div>

                                        <Progress
                                        value={percentage}
                                        indicator={
                                            type === "income" ? "bg-green-500" : "bg-red-500"
                                        }
                                    />
                                </div>
                                );
                            })}
                            </div>
                        </ScrollArea>
                    )}
            </div>
        </Card>
    );
}