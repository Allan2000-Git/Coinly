import { TimeFrame, TimePeriod } from '@/types/types'
import React from 'react'
import { getHistoryResponseType } from '../api/history/route';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IHistoryTimeFrameSelectorProps {
    timeFrame: TimeFrame;
    setTimeFrame: (timeFrame: TimeFrame) => void;
    timePeriod: TimePeriod;
    setTimePeriod: (timePeriod: TimePeriod) => void;
}

function HistoryTimeFrameSelector({timeFrame, setTimeFrame, timePeriod, setTimePeriod}:IHistoryTimeFrameSelectorProps) {
    const result = useQuery<getHistoryResponseType>({
        queryKey: ['overview', 'history'],
        queryFn: async () => {
            const response = await fetch("/api/history");
            if (!response.ok) {
                throw new Error('Something went wrong while fetching your history.');
            }
            const data = response.json();
            return data;
        },
    });

    return (
        <div className="flex flex-wrap items-center gap-4">
            <Tabs
            value={timeFrame}
            onValueChange={(value) => setTimeFrame(value as TimeFrame)}
            >
            <TabsList>
                <TabsTrigger value="year">Year</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
            </Tabs>
            <div className="flex flex-wrap items-center gap-2">
                <YearSelector
                timePeriod={timePeriod}
                setTimePeriod={setTimePeriod}
                years={result.data || []}
                />
                {
                    timeFrame === "month" && (
                        <MonthSelector timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
                    )
                }
            </div>
        </div>
    )
}

export default HistoryTimeFrameSelector

function YearSelector({timePeriod,setTimePeriod,years}: {timePeriod: TimePeriod, setTimePeriod: (period: TimePeriod) => void, years: getHistoryResponseType}) {
    return (
        <Select
            value={timePeriod.year.toString()}
            onValueChange={(value) => {
                setTimePeriod({
                month: timePeriod.month,
                year: parseInt(value),
            });
            }}
        >
            <SelectTrigger className="w-[180px]">
            <SelectValue />
            </SelectTrigger>
            <SelectContent>
            {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                {year}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
    );
}

function MonthSelector({timePeriod, setTimePeriod}: { timePeriod: TimePeriod, setTimePeriod: (period: TimePeriod) => void }) {
    return (
        <Select
        value={timePeriod.month.toString()}
        onValueChange={(value) => {
            setTimePeriod({
            year: timePeriod.year,
            month: parseInt(value),
            });
        }}
        >
        <SelectTrigger className="w-[180px]">
            <SelectValue />
        </SelectTrigger>
        <SelectContent>
            {[...Array(12)].map((_, monthIndex) => {
            const monthString = new Date(timePeriod.year, monthIndex, 1).toLocaleString(
                "default",
                { month: "long" }
            );

            return (
                <SelectItem key={monthIndex} value={monthIndex?.toString()}>
                    {monthString}
                </SelectItem>
            );
            })}
        </SelectContent>
        </Select>
    );
}