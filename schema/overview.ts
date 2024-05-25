import { MAX_DATE_RANGE_DAYS_ALLOWED } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import {z} from "zod";

export const overviewSchema = z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
}).refine((args) => {
    const {from, to} = args;
    const numOfDays = differenceInDays(to, from);
    const isValid = numOfDays >= 0 && numOfDays < MAX_DATE_RANGE_DAYS_ALLOWED;
    return isValid;
})

export type overviewSchemaType = z.infer<typeof overviewSchema>;  