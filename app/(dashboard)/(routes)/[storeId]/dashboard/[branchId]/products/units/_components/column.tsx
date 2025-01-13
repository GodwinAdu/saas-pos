"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

export const columns: ColumnDef<IUnit>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "quantity",
    header: "Unit Quantity",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => (
      <div>{row.original.createdBy?.fullName}</div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
