import Heading from '@/components/commons/Header'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { currentUserRole } from '@/lib/helpers/get-user-role'
import { cn } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
    // Fetch the current user's role
    const role = await currentUserRole();
    // Redirect to the homepage if the user has no role
    if (!role) {
        redirect("/")
    }

    // Destructure the 'addRole' permission from the user's role
    const { addSales } = role;
    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title="All Sales"
                />
                {addSales && (
                    <Link
                        href={`add-sales/create`}
                        className={cn(buttonVariants())}
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Sale
                    </Link>
                )}
            </div>
            <Separator />
            <div className="py-4">
                {/* <ProductTable brands={brands} categories={categories} /> */}
            </div>
        </>
    )
}

export default page