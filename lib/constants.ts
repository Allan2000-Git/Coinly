import { Currency } from "@/types/types";

export const currencies: Currency[] = [
    {
        value: "INR",
        label: "₹ Rupee",
        locale: "en-IN",
    },
    {
        value: "USD",
        label: "$ Dollar",
        locale: "en-US",
    },
    {
        value: "EUR",
        label: "€ Euro",
        locale: "en-EU"
    },
    {
        value: "GBP",
        label: "£ Pound",
        locale: "en-GB"
    },
    {
        value: "JPY",
        label: "¥ Yen",
        locale: "ja-JP"
    },
    {
        value: "CNY",
        label: "¥ Yuan",
        locale: "zh-CN"
    } 
];

export const MAX_DATE_RANGE_DAYS_ALLOWED = 90;
