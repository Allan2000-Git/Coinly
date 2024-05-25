import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query';
import React, { ReactNode, useCallback, useMemo } from 'react'
import { getBalanceStatsResponseType } from '../api/overview-statistics/route';
import { convertToUTCDate, formatCurrencyValue } from '@/lib/helpers';
import { PiggyBank, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import {
    Card,
} from "@/components/ui/card"  
import CountUp from 'react-countup';

interface IStatisticsCardsProps {
    userSettings: UserSettings;
    from: Date;
    to: Date;
}

function StatisticsCards({userSettings, from, to}:IStatisticsCardsProps) {
    const stats = useQuery<getBalanceStatsResponseType>({
        queryKey: ['overview', 'stats', from, to],
        queryFn: async () => {
            const response = await fetch(`/api/overview-statistics?from=${convertToUTCDate(from)}&to=${convertToUTCDate(to)}`);
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

    const income = stats.data?.income || 0;
    const expense = stats.data?.expense || 0;
    const balance = income - expense;

    return (
        <div className="w-full flex items-center justify-between flex-wrap gap-2">
            <StatisticsCard 
            title="Income"
            value={income}
            currencyFormatter={currencyFormatter}
            icon={<TrendingUpIcon className="h-12 w-12 text-green-500 bg-green-500/10 p-2 rounded-md" />}
            />
            <StatisticsCard 
            title="Expense"
            value={expense}
            currencyFormatter={currencyFormatter}
            icon={<TrendingDownIcon className="h-12 w-12 text-red-500 bg-red-500/10 p-2 rounded-md" />}
            />
            <StatisticsCard 
            title="Balance"
            value={balance}
            currencyFormatter={currencyFormatter}
            icon={<PiggyBank className="h-12 w-12 text-blue-500 bg-blue-500/10 p-2 rounded-md" />}
            />
        </div>
    )
}

export default StatisticsCards

interface IStatisticsCardProps {
    title: string;
    value: number;
    currencyFormatter: Intl.NumberFormat;
    icon: ReactNode;
}

function StatisticsCard({title, value, currencyFormatter, icon}:IStatisticsCardProps) {
    const formatFn = useCallback((value: number) => {
        return currencyFormatter.format(value);
    }, [currencyFormatter]);

    return (
        <Card className="w-[400px] h-24 flex items-center gap-4 p-4">
            {icon}
            <div className="flex flex-col">
                    <p className="text-muted-foreground text-sm">{title}</p>
                    <CountUp
                    preserveValue
                    decimals={2}
                    redraw={false}
                    end={value}
                    formattingFn={formatFn}
                    className="text-xl"
                    />
            </div>
        </Card>
    );
}