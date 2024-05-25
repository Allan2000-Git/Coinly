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

    const stats = await getCategoryStats(user.id, paramType.data.from, paramType.data.to);

    return NextResponse.json(stats);
}

export type getCategoryStatsResponseType = Awaited<ReturnType<typeof getCategoryStats>>;
async function getCategoryStats(userId: string, from: Date, to: Date){
    const total = await prisma.transaction.groupBy({
        by: ["type", "category", "categoryIcon"],
        where: {
            userId,
            date: {
                gte: from,
                lte: to
            }
        },
        _sum: {
            amount: true
        },
        orderBy: {
            _sum: {
                amount: "asc"
            }
        }
    });

    return total;
}