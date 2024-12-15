"use client";

import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { ClientSideRowModelModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Default Theme CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme CSS

import { ColDef } from "ag-grid-community";
import BrandSelection from "@/components/commons/BrandSelection";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { saveAs } from "file-saver"; // For CSV export
import * as XLSX from "xlsx"; // For Excel export
import jsPDF from "jspdf"; // For PDF export
import autoTable from "jspdf-autotable"; // For tables in PDF
import { File, Printer } from "lucide-react"; // Icons for buttons
import CategorySelection from "@/components/commons/CategorySelection";
import { Loader2 } from "lucide-react";
import { CellAction } from "./cell-action";

const ProductGrid = ({ brands, categories }: { brands: any[]; categories: any[] }) => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const gridRef = useRef<any>(null);

  // Apply one theme globally; you can switch themes dynamically if needed.
  const gridTheme = "ag-theme-alpine"; // Change to "ag-theme-quartz" for the Quartz theme.

  useEffect(() => {
    const newColDefs = [
      { field: "name", headerName: "Product Name" },
      { field: "sku", headerName: "Product SKU" },
      { field: "barcode", headerName: "Product Barcode" },
      { field: "cost", headerName: "Product Cost" },
      { field: "quantity", headerName: "Product Quantity" },
      { field: "createdBy", headerName: "Created By" },
      {
        field: "actions",
        headerName: "Actions",
        cellRenderer: CellAction,
      },
    ];
    setColDefs(newColDefs);
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch data logic here
      setRowData([
        // Dummy data for demonstration
        {
          name: "Product A",
          sku: "123456",
          barcode: "654321",
          cost: "100",
          quantity: "50",
          createdBy: "Admin",
        },
        {
          name: "Product B",
          sku: "654321",
          barcode: "123456",
          cost: "200",
          quantity: "30",
          createdBy: "User",
        },
      ]);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvData = rowData.map((row) =>
      colDefs.reduce((acc, col) => {
        const key = col.headerName || col.field;
        if (key) {
          acc[key] = row[col.field as keyof typeof row];
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
    const excelData = rowData.map((row) =>
      colDefs.reduce((acc, col) => {
        const key = col.headerName || col.field;
        if (key) {
          acc[key] = row[col.field as keyof typeof row];
        }
        return acc;
      }, {} as any)
    );
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    autoTable(pdf, {
      head: [
        colDefs
          .map((col) => col.headerName || col.field)
          .filter((header) => header !== undefined),
      ],
      body: rowData.map((row) =>
        colDefs.map((col) => row[col.field as keyof typeof row] || "")
      ),
    });
    pdf.save("data.pdf");
  };
  const pagination = true;
  const paginationPageSize = 200;
  const paginationPageSizeSelector = [200, 500, 1000];
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <BrandSelection SelectedBrand={(value) => setSelectedBrand(value)} brands={brands} />
          <CategorySelection
            SelectedCategory={(value) => setSelectedCategory(value)}
            categories={categories}
          />
          <Button disabled={isLoading} size="sm" onClick={fetchData}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <File className="mr-1 h-4 w-4" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <File className="mr-1 h-4 w-4" /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={exportToPDF}>
            <Printer className="mr-1 h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <div className={`${gridTheme} rounded-lg`} style={{ height: 500, width: "100%" }} ref={gridRef}>
        <AgGridReact
          modules={[ClientSideRowModelModule]}
          rowData={rowData}
          columnDefs={colDefs}
          rowModelType="clientSide"
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
        />
      </div>
    </>
  );
};

export default ProductGrid;


