import Heading from '@/components/commons/Header'
import React from 'react'
import StockAdjustmentForm from '../_components/StockAdjustmentForm'
import { Separator } from '@/components/ui/separator'

const page = () => {
  return (
    <>
      <div className="flex justify-between items-center">
                <Heading
                    title="New Stock Adjustments"
                />
            </div> 
            <Separator />
            <div className="py-4">
                <StockAdjustmentForm />
            </div>
    </>
  )
}

export default page
