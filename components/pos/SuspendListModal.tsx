
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Pause } from "lucide-react"
import { SuspendListAction } from "./SuspendListAction";

import { FC } from "react";

interface Product {
    _id: string;
    productId: { name: string };
    unit: { name: string; quantity: number };
    quantity: number;
    price: number;
}

interface SuspendItem {
    customerId: { name: string } | null;
    date: string;
    products: Product[];
}

interface SuspendListModalProps {
    products: SuspendItem[];
}

const SuspendListModal: FC<SuspendListModalProps> = ({ products }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon"><Pause className="w-4 h-4" /></Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[90%] flex flex-col items-start">
                <DialogHeader className="w-full">
                    <DialogTitle>Suspend Products</DialogTitle>
                </DialogHeader>
                <Table className="w-full">
                    <TableCaption>A list of your suspended products.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.map((suspendItem) => (
                            suspendItem.products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell className="font-medium">
                                        {suspendItem.customerId?.name || "Walk in Customer"}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(suspendItem.date).toLocaleDateString() || "N/A"}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {product.productId?.name || "N/A"}
                                    </TableCell>
                                    <TableCell>{`${product.unit?.name }(${product.unit.quantity})`|| "N/A"}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell className="text-right">{product.price}</TableCell>
                                    <TableCell className="text-right">
                                        <SuspendListAction data={suspendItem} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )
}

export default SuspendListModal;
