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


export function calculateTotalWithTax(amount:number, taxPercentage:number):number {
  return amount * (1 + taxPercentage / 100);
}


export const findManualPrice = (prices: any[], unitId: string) => {
    const priceObj = prices?.find(price => price.unitId._id === unitId);
    return calculateTotalWithTax(priceObj?.price, priceObj?.tax)
};

export const findAutomatedPrice = (
  product: any,
  units: any[],
  selectedUnit: string,
  selectedValue: string // Pass this as a parameter
) => {
  
  const retailCost = product?.retailPrice?.retailUnitCost;

  const retailMarkup = product?.retailPrice?.retailMarkupPercentage;

  const wholesaleCost = product?.wholesalePrice?.wholesaleUnitCost;
 
  const wholesaleMarkup = product?.wholesalePrice?.wholesaleMarkupPercentage;

  const findUnit = units.find((unit) => unit._id === selectedUnit);
  
  if (!findUnit) {
    throw new Error('Selected unit not found');
  }

  if (selectedValue === 'retail') {
    const totalRetailCost =
      retailCost * findUnit?.quantity * (1 + retailMarkup / 100);
    return totalRetailCost;
  } else if (selectedValue === 'wholesale') {
    const totalWholesaleCost =
      wholesaleCost * findUnit?.quantity * (1 + wholesaleMarkup / 100);
    return totalWholesaleCost;
  }

  throw new Error('Invalid selectedValue');
};
