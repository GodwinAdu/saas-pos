import Heading from '@/components/commons/Header'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import StockAdjustmentForm from './_components/StockAdjustmentForm'
import { currentBranch } from '@/lib/helpers/current-branch'
import { getCurrencySymbol } from '@/lib/settings/store.settings'

const page = async ({ params }: { params: BranchIdParams }) => {
    const { branchId } = await params;
    const branch = await currentBranch(branchId);
    const currency = await getCurrencySymbol();
    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title="New Stock Adjustments"
                />
            </div>
            <Separator />
            <div className="py-4">
                <StockAdjustmentForm currency={currency} branch={branch} />
            </div>
        </>
    )
}

export default page

