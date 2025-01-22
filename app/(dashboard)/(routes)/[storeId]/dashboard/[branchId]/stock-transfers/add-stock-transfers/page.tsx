import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import StockTransferForm from './_components/StockTransferForm'
import { currentBranch } from '@/lib/helpers/current-branch'

const page = async ({ params }: { params: BranchIdParams }) => {
    const { branchId } = await params;
    const branch = await currentBranch(branchId);
    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title="New Stock Transfer"
                />

            </div>
            <Separator />
            <div className="py-4">
                <StockTransferForm branch={branch} />
            </div>
        </>
    )
}

export default page
