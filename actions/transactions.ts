"use server"

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { createTransactionSchema, createTransactionSchemaType } from "@/schema/transaction";

export async function createTransaction(formData: createTransactionSchemaType) {
    const parsedTransaction = createTransactionSchema.safeParse(formData);
    if(!parsedTransaction.success){
        throw new Error(parsedTransaction.error.message);
    }

    const user = await currentUser();
    if(!user){
        return redirect("/sign-in");
    }

    const {amount, category, date, type, description} = parsedTransaction.data;

    // check if category selected exists or not
    const doesCategoryExist = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category
        }
    });
    if(!doesCategoryExist){
        throw new Error("Selected category does not exist.");
    }

    const newTransaction = await prisma.$transaction([
        prisma.transaction.create({
            data: {
                userId: user.id,
                amount, 
                date, 
                type,
                categoryIcon: doesCategoryExist.icon, 
                category: doesCategoryExist.name, 
                description: description || ""
            }
        }),

        prisma.monthHistory.upsert({
            where: {
                userId_day_month_year: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
            },
            create: {
                userId: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                income: type === "income" ? amount : 0,
                expense: type === "expense" ? amount : 0,
            },
            update: {
                income: {
                    increment: type === "income" ? amount : 0
                },
                expense: {
                    increment: type === "expense" ? amount : 0
                }
            }
        }),

        prisma.yearHistory.upsert({
            where: {
                userId_month_year: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
            },
            create: {
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                income: type === "income" ? amount : 0,
                expense: type === "expense" ? amount : 0,
            },
            update: {
                income: {
                    increment: type === "income" ? amount : 0
                },
                expense: {
                    increment: type === "expense" ? amount : 0
                }
            }
        })
    ]);

    return newTransaction[0];
}