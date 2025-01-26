'use client';


import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: 'referenceNo',
        header: 'Reference',
    },
    {
        accessorKey: 'totalAmount',
        header: 'Total Amount',
    },
    {
        accessorKey: 'createdBy',
        header: 'Created By',
        cell: ({ row }) => <div>{row.original.createdBy?.fullName}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
