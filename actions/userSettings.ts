"use server"

import { updateCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateCurrency(currency: string){
    const parsedCurrency = updateCurrencySchema.safeParse({currency});
    if(!parsedCurrency.success){
        throw parsedCurrency.error;
    }

    const user = await currentUser();
    if(!user){
        return redirect("/sign-in");
    }

    const userSettings = await prisma.userSettings.update({
        where: {
            userId: user.id
        },
        data: {
            currency
        }
    });

    return userSettings;
}