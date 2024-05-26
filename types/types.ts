export type Currency = {
    value: string
    label: string
    locale: string
}

export type Transaction = "income" | "expense";

export type TimeFrame = "month" | "year";
export type TimePeriod = {
    month: number;
    year: number;
}

export type HistoryData = {
    expense: number;
    income: number;
    year: number;
    month: number;
    day?: number;
};