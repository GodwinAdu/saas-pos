import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import StockTransferForm from '../_components/StockTransferForm'

const page = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title="New Stock Transfer"
                />

            </div>
            <Separator />
            <div className="py-4">
                <StockTransferForm />
            </div>
        </>
    )
}

export default page
