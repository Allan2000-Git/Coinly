import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request:Request) {
    const user = await currentUser();

    if(!user){
        return NextResponse.redirect("/sign-in");
    }

    let userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id
        }
    });

    if(!userSettings) {
        userSettings = await prisma.userSettings.create({
            data: {
                userId: user.id,
                currency: "INR"
            }
        });
    }

    revalidatePath("/dashboard");

    return NextResponse.json(userSettings)
}