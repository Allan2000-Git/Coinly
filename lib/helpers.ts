import { currencies } from "./constants"

export const convertToUTCDate = (date: Date) => {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        )
    )
}

export const formatCurrencyValue = (currency: string) => {
    const type = currencies.find((c) => c.value === currency)?.locale;
    return new Intl.NumberFormat(type, {
        style: "currency",
        currency
    });
}