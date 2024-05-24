"use server"

import { createCategorySchema, createCategorySchemaType } from "@/schema/category";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function createCategory(formData: createCategorySchemaType){
    const parsedCategory = createCategorySchema.safeParse(formData);
    if(!parsedCategory.success){
        throw new Error(parsedCategory.error.message);
    }

    const user = await currentUser();
    if(!user){
        return redirect("/sign-in");
    }

    const {name, icon, type} = parsedCategory.data;
    const newCategory = await prisma.category.create({
        data: {
            userId: user.id,
            name, 
            icon,
            type
        }
    })

    return newCategory;
}