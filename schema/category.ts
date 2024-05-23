import {z} from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1, {message: "Name is required"}).max(50, {message: "Name is too long"}),
    icon: z.string().min(1, {message: "Name is required"}),
    type: z.enum(["income", "expense"])
});

export type createCategorySchemaType = z.infer<typeof createCategorySchema>;  