import {z} from "zod";

export const createTransactionSchema = z.object({
    amount: z.coerce.number().positive(),
    description: z.string().optional(),
    category: z.string(),
    type: z.union([z.literal("income"), z.literal("expense")]),
    date: z.coerce.date(),
})

export type createTransactionSchemaType = z.infer<typeof createTransactionSchema>;  