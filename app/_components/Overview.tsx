"use client";

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS_ALLOWED } from '@/lib/constants';
import { differenceInDays, startOfMonth } from 'date-fns'
import React, { useState } from 'react'
import { toast } from 'sonner';
import StatisticsCards from './StatisticsCards';
import { UserSettings } from '@prisma/client';
import CategoryStatisticsCards from './CategoryStatisticsCards';

interface IOverviewProps {
    userSettings: UserSettings;
}

function Overview({userSettings}:IOverviewProps) {
    const [dateRange, setDateRange] = useState<{from: Date, to: Date}>({
        from: startOfMonth(new Date()),
        to: new Date()
    })

    return (
        <>
            <div className="container flex flex-col gap-6 py-4">
                <div className="flex flex-wrap items-center justify-between py-4">
                    <p className="text-lg font-semibold">Overview</p>
                    <DateRangePicker 
                    initialDateFrom={dateRange.from}
                    initialDateTo={dateRange.to}
                    showCompare={false}
                    onUpdate={(values) => {
                        const {from, to} = values.range;
                        if(!from || !to) return;
                        if(differenceInDays(to, from) > MAX_DATE_RANGE_DAYS_ALLOWED){
                            toast.error(`Maxmium allowed date range days is ${MAX_DATE_RANGE_DAYS_ALLOWED} days`);
                            return;
                        }
                        setDateRange({from, to});
                    }}
                    />
                </div>
                <StatisticsCards userSettings={userSettings} from={dateRange.from} to={dateRange.to} />
                <CategoryStatisticsCards userSettings={userSettings} from={dateRange.from} to={dateRange.to} />
            </div>
        </>
    )
}

export default Overview