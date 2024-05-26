"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrencyValue } from '@/lib/helpers';
import { TimeFrame, TimePeriod } from '@/types/types';
import { UserSettings } from '@prisma/client';
import React, { useCallback, useMemo, useState } from 'react'
import HistoryTimeFrameSelector from './HistoryTimeFrameSelector';
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import CountUp from 'react-countup';
import { cn } from '@/lib/utils';

interface IOverviewProps {
    userSettings: UserSettings;
}

function History({userSettings}:IOverviewProps) {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");
    const [timePeriod, setTimePeriod] = useState<TimePeriod>({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });

    const currencyFormatter = useMemo(() => {
        return formatCurrencyValue(userSettings.currency);
    }, [userSettings.currency]);

    const historyDataQuery = useQuery({
        queryKey: ["overview", "history", timeFrame, timePeriod],
        queryFn: async () => {
                const response = await fetch(`/api/history-data?timeFrame=${timeFrame}&year=${timePeriod.year}&month=${timePeriod.month}`);
                if (!response.ok) {
                    throw new Error('Something went wrong while fetching your history.');
                }
                const data = response.json();
                return data;
            }   
        });
    
    const isHistoryDataAvailable = historyDataQuery.data && historyDataQuery.data.length > 0;

    return (
        <div className="container flex flex-col gap-6 py-4">
            <p className="text-lg font-semibold">History</p>
            <Card className="col-span-12 mt-2 w-full">
                <CardHeader className="gap-2">
                    <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
                        <HistoryTimeFrameSelector 
                        timeFrame={timeFrame} 
                        setTimeFrame={setTimeFrame} 
                        timePeriod={timePeriod}
                        setTimePeriod={setTimePeriod}
                        />
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="p-2 gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                Income
                            </Badge>
                            <Badge variant="outline" className="p-2 gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                Expense
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        isHistoryDataAvailable && (
                        <ResponsiveContainer width={"100%"} height={300}>
                            <BarChart
                            height={300}
                            data={historyDataQuery.data}
                            barCategoryGap={5}
                            >
                            <defs>
                                <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset={"0"}
                                    stopColor="#10b981"
                                    stopOpacity={"1"}
                                />
                                <stop
                                    offset={"1"}
                                    stopColor="#10b981"
                                    stopOpacity={"0"}
                                />
                                </linearGradient>

                                <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset={"0"}
                                    stopColor="#ef4444"
                                    stopOpacity={"1"}
                                />
                                <stop
                                    offset={"1"}
                                    stopColor="#ef4444"
                                    stopOpacity={"0"}
                                />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="5 5"
                                strokeOpacity={"0.2"}
                                vertical={false}
                            />
                            <XAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                padding={{ left: 5, right: 5 }}
                                dataKey={(data) => {
                                const { year, month, day } = data;
                                const date = new Date(year, month, day || 1);
                                if (timeFrame === "year") {
                                    return date.toLocaleDateString("default", {
                                    month: "long",
                                    });
                                }
                                return date.toLocaleDateString("default", {
                                    day: "2-digit",
                                });
                                }}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Bar
                                dataKey={"income"}
                                label="Income"
                                fill="url(#incomeBar)"
                                radius={4}
                                className="cursor-pointer"
                            />
                            <Bar
                                dataKey={"expense"}
                                label="Expense"
                                fill="url(#expenseBar)"
                                radius={4}
                                className="cursor-pointer"
                            />
                            <Tooltip
                                cursor={{ opacity: 0.1 }}
                                content={(props) => (
                                    <CustomTooltip formatter={currencyFormatter} {...props} />
                                )}
                            />
                            </BarChart>
                        </ResponsiveContainer>
                        )}
                        {
                            !isHistoryDataAvailable && (
                            <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                                No data for the selected period
                                <p className="text-sm text-muted-foreground">
                                Try selecting a different period or adding new transactions
                                </p>
                            </Card>
                        )}
                    </CardContent>
            </Card>
        </div>
    )
}

export default History

function CustomTooltip({ active, payload, formatter }: any) {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    const { expense, income } = data;

    return (
        <div className="min-w-[300px] rounded border bg-background p-4">
            <TooltipRow
            formatter={formatter}
            label="Expense"
            value={expense}
            bgColor="bg-red-500"
            textColor="text-red-500"
            />
            <TooltipRow
            formatter={formatter}
            label="Income"
            value={income}
            bgColor="bg-green-500"
            textColor="text-green-500"
            />
            <TooltipRow
            formatter={formatter}
            label="Balance"
            value={income - expense}
            bgColor="bg-gray-100"
            textColor="text-foreground"
            />
        </div>
    );
}

function TooltipRow({
    label,
    value,
    bgColor,
    textColor,
    formatter,
}: {
    label: string;
    textColor: string;
    bgColor: string;
    value: number;
    formatter: Intl.NumberFormat;
}) {
    const formattingFn = useCallback((value: number) => {
            return formatter.format(value);
        },[formatter]);

    return (
        <div className="flex items-center gap-2">
            <div className={cn("h-4 w-4 rounded-full", bgColor)} />
            <div className="flex w-full justify-between">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className={cn("text-sm font-bold", textColor)}>
                <CountUp
                duration={0.5}
                preserveValue
                end={value}
                decimals={0}
                formattingFn={formattingFn}
                className="text-sm"
                />
            </div>
            </div>
        </div>
    );
}