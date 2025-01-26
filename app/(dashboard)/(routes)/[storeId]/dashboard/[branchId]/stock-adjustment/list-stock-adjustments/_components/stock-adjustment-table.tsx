"use client";

import { DataTable } from "@/components/table/data-table";
import { Separator } from "@/components/ui/separator";
import React, { useCallback, useEffect, useState } from "react";
import { fetchSalesByDate } from "@/lib/actions/sale.actions";
import { DateRangePicker } from "@/components/commons/DateRangePicker";
import { DateRange } from "react-day-picker";
import { debounce } from "lodash";
import { columns } from "./column";
import { fetchAdjustmentByDate } from "@/lib/actions/stock-adjustment.actions";

const StockAdjustmentTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 11, 31),
  });

  const [adjustmentData, setAdjustmentData] = useState([]);


  // useEffect(() => {
  //   // Ensure `dateRange` has valid values before fetching data
  //   if (!dateRange?.from || !dateRange?.to) return;

  //   let isMounted = true; // Flag to track if the component is still mounted

  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const sales = await fetchSalesByDate(dateRange.from as Date, dateRange.to as Date);
  //       if (isMounted) {
  //         setAdjustmentData(sales);
  //       }
  //     } catch (error) {
  //       if (isMounted) {
  //         console.error("Failed to fetch sales:", error);
  //       }
  //     } finally {
  //       if (isMounted) {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   fetchData();

  //   return () => {
  //     isMounted = false; // Cleanup to prevent state updates after unmount
  //   };
  // }, [dateRange]);

  const fetchAdjustment = async (from: Date, to: Date) => {
    setIsLoading(true);
    try {
      const adjustment = await fetchAdjustmentByDate(from, to);
      setAdjustmentData(adjustment);
    } catch (error) {
      console.error("Error fetching Adjustment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced version of the fetchAdjustment function
  const debouncedFetchAdjustment = useCallback(
    debounce((from, to) => {
      fetchAdjustment(new Date(from), new Date(to));
    }, 500), // 500ms debounce delay
    []
  );

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      debouncedFetchAdjustment(dateRange.from, dateRange.to);
    }

    // Cleanup the debounced function on unmount
    return () => {
      debouncedFetchAdjustment.cancel();
    };
  }, [dateRange, debouncedFetchAdjustment]);


  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <DateRangePicker
            className="w-[300px]"
            onDateRangeChange={setDateRange}
          />
        </div>
      </div>
      <Separator />
      <DataTable isLoading={isLoading} searchKey="adjustmentType" columns={columns} data={adjustmentData} />
    </>
  );
};

export default StockAdjustmentTable;
