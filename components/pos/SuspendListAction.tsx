"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, PlusCircleIcon, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBrand } from "@/lib/actions/brand.actions";
import { playErrorSound, playSuccessSound } from "@/lib/audio";
import { toast } from "@/hooks/use-toast";
import { DeleteDialog } from "@/components/commons/DeleteDialog";
import { useCartStore } from "@/hooks/use-cart";
import { fetchBranchById } from "@/lib/actions/branch.actions";
import Product from '../../lib/models/product.models';

interface ProductToAdd {
    product: {
        _id: string;
        name: string;
        stock: number;
        manualPrice: { price: number; unitId: { _id: string } }[];
        images: string[];
    };
    unit: string;
    quantity: number;
}

interface ProductToAdd {
    product: {
        _id: string;
        name: string;
        stock: number;
        manualPrice: { price: number; unitId: { _id: string } }[];
        images: string[];
    };
    unit: string;
    quantity: number;
}





interface CellActionProps {
    data: any;
}

export const SuspendListAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [branch, setBranch] = useState<any>(null);
    const addMultipleToCart = useCartStore((state) => state.addMultipleToCart);

    const branchId = params.branchId as string;

    const fetchBranch = async () => {
        try {
            const branch = await fetchBranchById(branchId);
            setBranch(branch);
        } catch {
            toast({
                title: "Something Went Wrong",
                description: "Unable to fetch branch. Please try again later.",
                variant: "destructive",
            })
        }
    };

    useEffect(() => {
        fetchBranch();
    }, []);

    console.log(branch, 'branch')

    const handleAddCart = async () => {
        try {
            interface ProductToAdd {
                product: Product;
                unit: string;
                quantity: number;
                name: string;
                stock: number;
                images: string[];
            }

            // const productsToAdd: ProductToAdd[] = data.products.map((product: any) => ({
            //     product: product.,
            //     unit: product.unit._id,
            //     quantity: product.quantity,
            //     name: product.name,
            //     stock: product.stock,
            //     images: product.images,
            // }));
    
            addMultipleToCart(branch, data.products);
            playSuccessSound();
            router.refresh();
            toast({
                title: "Added to Cart",
                description: "All products have been added to your cart successfully.",
                variant: "success",
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            playErrorSound();
            toast({
                title: "Something Went Wrong",
                description: "Unable to add products to cart. Please try again later.",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteBrand(id);
            playSuccessSound();
            router.refresh();
            toast({
                title: "Deleted successfully",
                description: "The product has been deleted.",
                variant: "success",
            });
        } catch {
            playErrorSound();
            toast({
                title: "Something Went Wrong",
                description: "Please try again later",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddCart();
                            }}
                        >
                            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add to Cart
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                setDeleteDialogOpen(true);
                            }}
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </>
                </DropdownMenuContent>
            </DropdownMenu>
            {isDeleteDialogOpen && (
                <DeleteDialog
                    id={data?._id}
                    isDeleteDialogOpen={isDeleteDialogOpen}
                    title="Are you sure you want to delete this suspended product?"
                    description="This action cannot be undone. Are you sure you want to proceed?"
                    onCancel={() => setDeleteDialogOpen(false)}
                    onContinue={() => handleDelete(data._id)}
                />
            )}
        </>
    );
};
