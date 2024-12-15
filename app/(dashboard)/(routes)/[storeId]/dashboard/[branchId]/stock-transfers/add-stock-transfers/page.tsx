import Heading from '@/components/commons/Header'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { currentUserRole } from '@/lib/helpers/get-user-role'
import { cn } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = async () => {

    const role = await currentUserRole() as IRole

    const { addStockTransfer } = role
    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title="Stock Transfers"
                />
                {addStockTransfer && (
                    <Link
                        href={`add-stock-transfers/create`}
                        className={cn(buttonVariants())}
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Purchase
                    </Link>
                )}
            </div>
            <Separator />
        </>
    )
}

export default page
