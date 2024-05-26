import prisma from "@/lib/prisma";
import { getHistoryDataSchema } from "@/schema/history";
import { HistoryData, TimeFrame, TimePeriod } from "@/types/types";
import { currentUser } from "@clerk/nextjs";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
    const timeFrame = searchParams.get("timeFrame");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const queryParams = getHistoryDataSchema.safeParse({
        timeFrame,
        month,
        year,
    });

    if (!queryParams.success) {
        return Response.json(queryParams.error.message, {
            status: 400,
        });
    }

    const data = await getHistoryData(user.id, queryParams.data.timeFrame, {
        month: queryParams.data.month,
        year: queryParams.data.year,
    });

    return NextResponse.json(data);
}

export type getHistoryDataResponseType = Awaited<ReturnType<typeof getHistoryData>>;

async function getHistoryData(
    userId: string,
    timeFrame: TimeFrame,
    period: TimePeriod
) {
    switch (timeFrame) {
        case "year":
            return await getYearHistoryData(userId, period.year);
        case "month":
            return await getMonthHistoryData(userId, period.year, period.month);
    }
}

async function getYearHistoryData(userId: string, year: number) {
    const result = await prisma.yearHistory.groupBy({
        by: ["month"],
        where: {
            userId,
            year,
        },
        _sum: {
            income: true,
            expense: true
        },
        orderBy: [
            {
                month: "asc",
            },
        ],
    });

    if (!result || result.length === 0) return [];

    const history: HistoryData[] = [];

    for(let i = 0; i < 12; i++) {
        let income = 0;
        let expense = 0;

        const month = result.find((row) => row.month === i);
        if (month) {
            income = month._sum.income || 0;
            expense = month._sum.expense || 0;
        }

        history.push({
            month: i,
            year,
            income,
            expense
        });
    }

    return history;
}

async function getMonthHistoryData(
    userId: string,
    year: number,
    month: number
) {
    const result = await prisma.monthHistory.groupBy({
        by: ["day"],
        where: {
            userId,
            year,
            month,
        },
        _sum: {
            income: true,
            expense: true
        },
        orderBy: [
            {
                day: "asc",
            },
        ],
    });

    if (!result || result.length === 0) return [];

    const history: HistoryData[] = [];
    const daysInMonth = getDaysInMonth(new Date(year, month));

    for(let i = 1; i <= daysInMonth; i++) {
        let income = 0;
        let expense = 0;

        const day = result.find((row) => row.day === i);
        if (day) {
            income = day._sum.income || 0;
            expense = day._sum.expense || 0;
        }

        history.push({
            day: i,
            month,
            year,
            income,
            expense
        });
    }

    return history;
}