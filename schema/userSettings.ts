import { currencies } from "@/lib/constants";
import {z} from "zod";

export const updateCurrencySchema = z.object({
    currency: z.custom((value) => {
        const isCurrencyAvailable = currencies.some((c) => c.value === value);
        if(!isCurrencyAvailable){
            throw new Error(`Currency ${value} is not available`);
        }
        return value;
    })
})