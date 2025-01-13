import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'

const page = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title="List Purchases"
                />

            </div>
            <Separator />
        </>
    )
}

export default page