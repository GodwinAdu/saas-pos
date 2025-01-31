import { currentStore } from "../helpers/current-store";

const currencySymbols: Record<string, string> = {
    GHS: "₵", // Ghanaian Cedi
    USD: "$", // US Dollar
    EUR: "€", // Euro
    JPY: "¥", // Japanese Yen
    CAD: "C$", // Canadian Dollar
    AUD: "A$", // Australian Dollar
};

export const getCurrencySymbol = async (): Promise<string> => {
    const store = await currentStore();
    const defaultCurrency = store.paymentSettings.defaultCurrency;

    // Return the corresponding symbol or fallback to the currency code
    return currencySymbols[defaultCurrency] || defaultCurrency;
};



export const paymentMethods = async () => {
    const store = await currentStore();
    return store.paymentSettings.paymentMethods;
}