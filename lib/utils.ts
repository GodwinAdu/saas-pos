import { clsx, type ClassValue } from "clsx"
import moment from "moment";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const getStartAndEndOfMonth = (month: number, year: number) => {
  const startDate = new Date(year, month - 1, 1); // Month is 0-indexed
  const endDate = new Date(year, month, 0); // Last day of the month
  return { startDate, endDate };
};

export const dayLeft = (date: Date) => {
  // Define the target date
  const targetDate = moment(date, 'YYYY-MM-DD');

  // Get today's date
  const today = moment();

  // Calculate the difference in days
  const daysLeft = targetDate.diff(today, 'days');
  return daysLeft;
}

export function getNextDate(today: Date, period: number): Date {
  const nextDate = new Date(today);

  // Add the specified period (in months) to the current date
  nextDate.setMonth(today.getMonth() + period);

  // Handle cases where adding months results in a day mismatch
  if (nextDate.getDate() !== today.getDate()) {
    nextDate.setDate(0); // Adjust to the last day of the previous month if the day mismatches
  }

  return nextDate;
}

export function getNextMonthDate(today: Date): Date {
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  if (nextMonth.getDate() !== today.getDate()) {
    nextMonth.setDate(0); // Last day of the previous month if day mismatch
  }
  return nextMonth;
}


export function calculateTotalWithTax(amount: number, taxPercentage: number): number {
  return amount * (1 + taxPercentage / 100);
}


interface Price {
  unitId: { _id: string };
  price: number;
  tax: number;
}

// calculate manual price for branch products
export const findManualPrice = (prices: Price[], unitId: string) => {
  console.log(prices, unitId)
  const priceObj = prices?.find(price => price.unitId._id === unitId);
  return calculateTotalWithTax(priceObj?.price ?? 0, priceObj?.tax ?? 0)
};

export const findManualPurchasePrice = (
  units: { _id: string; quantity: number }[],
  selectedUnit: string,
  quantity: number,
  price: number
) => {
  const findUnit = units?.find((unit) => unit._id === selectedUnit);
  const total = findUnit && findUnit?.quantity * price
  const grandTotal = quantity * total!
  return grandTotal.toFixed(2)
}

// calculate automated price for branch products
export const findAutomatedPrice = (
  product: {
    retailPrice?: { retailUnitCost: number; retailMarkupPercentage: number };
    wholesalePrice?: { wholesaleUnitCost: number; wholesaleMarkupPercentage: number };
  },
  units: { _id: string; quantity: number }[],
  selectedUnit: string,
  selectedValue: string // Pass this as a parameter
) => {

  const retailCost = product?.retailPrice?.retailUnitCost;

  const retailMarkup = product?.retailPrice?.retailMarkupPercentage;

  const wholesaleCost = product?.wholesalePrice?.wholesaleUnitCost;

  const wholesaleMarkup = product?.wholesalePrice?.wholesaleMarkupPercentage;

  const findUnit = units?.find((unit) => unit._id === selectedUnit);

  if (!findUnit) {
    throw new Error('Selected unit not found');
  }

  if (selectedValue === 'retail') {
    const totalRetailCost =
      (retailCost ?? 0) * findUnit?.quantity * (1 + (retailMarkup ?? 0) / 100);
    return totalRetailCost;
  } else if (selectedValue === 'wholesale') {
    const totalWholesaleCost =
      (wholesaleCost ?? 0) * findUnit?.quantity * (1 + (wholesaleMarkup ?? 0) / 100);
    return totalWholesaleCost;
  }
};

export function calculateQuantity(selectedUnit: string, quantity: number, units: { _id: string, quantity: number }[]): number {
  const findUnit = units.find(u => u._id === selectedUnit);
  const value = findUnit ? findUnit.quantity * quantity : 0;
  return Math.round(value);
}

export function debounce<T extends (...args: string[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void { // Explicitly type 'this' as 'ThisParameterType<T>'
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function generateReferenceNumber(prefix = "REF") {
  const timestamp = Date.now().toString(36).toUpperCase(); // Base36 timestamp
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random string
  return `${prefix}-${timestamp}-${randomPart}`;
}


