'use client';


import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: 'products',
        header: 'Products',
        cell: ({ row }) => <ProductButton data={row.original} />,
    },
    {
        accessorKey: 'referenceNo',
        header: 'Reference',
    },
    {
        accessorKey: 'totalAmount',
        header: 'Total Amount',
        cell: ({ row }) => <div>{row.original.totalAmount}</div>,
    },
    {
        accessorKey: 'adjustmentType',
        header: 'Adjustment Type',
        cell: ({ row }) => (
            row.original.adjustmentType && (
                <span
                    className={`px-2 py-1 mr-2 rounded text-sm font-medium ${row.original.adjustmentType === "normal"
                        ? "bg-green-100 text-green-700"
                        : row.original.adjustmentType === "remove"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                >
                    {row.original.adjustmentType}
                </span>
            )
        ),
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

// Button Component for Product Column
const ProductButton = ({ data }: { data: any }) => {

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        View
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] p-6 bg-white rounded-lg shadow-lg h-[70%] overflow-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-800">Sale Details</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            Review the detailed information about this transaction.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        {/* Transaction Info */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Adjustment Information</h2>
                            <p><strong>Reference No:</strong> {data?.referenceNo}</p>
                            <p><strong>Adjustment Date:</strong> {new Date(data.adjustmentDate).toLocaleString()}</p>
                            <p><strong>Reason:</strong> {data.reason}</p>
                        </div>

                        {/* Products */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Products</h2>
                            <div className="border border-gray-200 rounded-md p-4">
                                {data.products.map((product, index) => (
                                    <div
                                        key={product._id}
                                        className="flex justify-between items-center border-b border-gray-200 py-2 last:border-none"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Image
                                                width={100}
                                                height={100}
                                                src={product.productId.images[0]}
                                                alt={product.productId.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">{product.productId.name}</p>
                                                <p className="text-sm text-gray-500">Unit: {product.unit.name}{`(${product.unit.quantity})`}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p>Qty: {product.totalQuantity}</p>
                                            <p className="font-medium text-gray-800">
                                                Subtotal: ${product.subTotal}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-6 border-t pt-4">
                            <h2 className="text-lg font-semibold text-gray-700">Summary</h2>
                            <p className="text-xl font-bold text-gray-800">
                                Total Amount: ${data.totalAmount}
                            </p>
                        </div>
                    </div>

                </DialogContent>
            </Dialog>


        </>
    );
};
