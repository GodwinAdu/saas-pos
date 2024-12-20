"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { File, Printer, Loader2 } from 'lucide-react';
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface FilterOption {
  _id: string;
  label: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  searchKey?: string;
  data: TData[];
  filterGroups?: FilterGroup[];
  onFilterChange?: (filters: Record<string, string>) => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  filterGroups,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

  const exportToCSV = () => {
    const csvData = data.map((row) =>
      columns.reduce((acc, col) => {
        if (col.accessorKey) {
          acc[col.header as string] = row[col.accessorKey as keyof typeof row];
        }
        return acc;
      }, {} as any)
    );

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "data.csv");
  };

  const exportToExcel = () => {
    const excelData = data.map((row) =>
      columns.reduce((acc, col) => {
        if (col.accessorKey) {
          acc[col.header as string] = row[col.accessorKey as keyof typeof row];
        }
        return acc;
      }, {} as any)
    );
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: data.map((row) =>
        columns.map((col) => row[col.accessorKey as keyof typeof row] || "")
      ),
    });
    doc.save("data.pdf");
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
        <Input
          placeholder={`Search by ${searchKey}`}
          value={
              (table?.getColumn(searchKey)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
          {filterGroups && filterGroups.map((filterGroup) => (
            <Select
              key={filterGroup.id}
              onValueChange={(value) => handleFilterChange(filterGroup.id, value)}
              value={filters[filterGroup.id] || ""}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filterGroup.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All {filterGroup.label}</SelectItem>
                {filterGroup.options.map((option) => (
                  <SelectItem key={option._id} value={option._id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <File className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button variant="outline" onClick={exportToExcel}>
            <File className="mr-2 h-4 w-4" /> Excel
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <Printer className="mr-2 h-4 w-4" /> PDF
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

    </div>
  );
}
