import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { z } from 'zod';
import { overviewSchema } from '@/schema/overview';

export async function GET(request:Request) {
    const user = await currentUser();

    if(!user){
        return NextResponse.redirect("/sign-in");
    }

    const {searchParams} = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const paramType = overviewSchema.safeParse({from, to});

    if(!paramType.success){
        return NextResponse.json(paramType.error.message, {
            status: 500
        });
    } 

    const stats = await getBalanceStats(user.id, paramType.data.from, paramType.data.to);

    return NextResponse.json(stats);
}

export type getBalanceStatsResponseType = Awaited<ReturnType<typeof getBalanceStats>>;
async function getBalanceStats(userId: string, from: Date, to: Date){
    const total = await prisma.transaction.groupBy({
        by: ["type"],
        where: {
            userId,
            date: {
                gte: from,
                lte: to
            }
        },
        _sum: {
            amount: true
        }
    });

    const income = total.find((t) => t.type === "income")?._sum.amount || 0;
    const expense = total.find((t) => t.type === "expense")?._sum.amount || 0;

    return {
        income, expense
    };
}