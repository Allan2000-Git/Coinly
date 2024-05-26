import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request:Request) {
    const user = await currentUser();

    if(!user){
        return NextResponse.redirect("/sign-in");
    }

    const result = await getHistory(user.id);

    return NextResponse.json(result);
}

export type getHistoryResponseType = Awaited<ReturnType<typeof getHistory>>;
async function getHistory(userId: string){
    const result = await prisma.monthHistory.findMany({
        where: {
            userId
        },
        select: {
            year: true
        },
        distinct: ["year"],
        orderBy: {
            year: "asc"
        }
    });

    const years = result.map(res => res.year);
    if(years.length === 0){
        return [new Date().getFullYear()];
    }
    return years;
}