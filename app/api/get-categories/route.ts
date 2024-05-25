import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { z } from 'zod';

export async function GET(request:Request) {
    const user = await currentUser();

    if(!user){
        return NextResponse.redirect("/sign-in");
    }

    const {searchParams} = new URL(request.url);
    const queryType = searchParams.get("type");

    const typeValidator = z.enum(["income", "expense"]).nullable();
    const paramType = typeValidator.safeParse(queryType);

    if(!paramType.success){
        return NextResponse.json(paramType.error.message, {
            status: 500
        });
    }

    const type = paramType.data;

    const categories = await prisma.category.findMany({
        where: {
            userId: user.id,
            ...(type && {type})
        },
        orderBy: {
            name: "asc"
        }
    });

    return NextResponse.json(categories);
}