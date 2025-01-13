import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import StockAdjustmentTable from './_components/stock-adjustment-table'

const page = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title="Stock Adjustments Lists"
                />

            </div>
            <Separator />
            <div className="">
                <StockAdjustmentTable />
            </div>
        </>
    )
}

export default page