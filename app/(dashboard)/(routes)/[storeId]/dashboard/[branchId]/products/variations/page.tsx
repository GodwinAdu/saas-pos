import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { VariationModal } from './_components/VariationModal'
import { fetchAllBranches } from '@/lib/actions/branch.actions'
import { currentUser } from '@/lib/helpers/current-user'
import { fetchAllVariationsByBranchId } from '@/lib/actions/variation.actions'
import { DataTable } from '@/components/table/data-table'
import { columns } from './_components/column'

const page = async () => {
    const user  = await currentUser();
    const branches = await fetchAllBranches() || [];

    const variations = await fetchAllVariationsByBranchId() || [];

    return (
        <>
            <div className="flex justify-between items-center px-3">
                <Heading title="Manage Variations" />
                <div className="flex gap-4">
                    <VariationModal branches={branches} user={user} />
                </div>
            </div>
            <Separator />
            <DataTable searchKey='name' data={variations} columns={columns} />
        </>
    )
}

export default page
