import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { WarrantModal } from './_components/WarrantModal'
import { DataTable } from '@/components/table/data-table'
import { columns } from './_components/column'
import { fetchAllWarrants } from '@/lib/actions/warrant.actions'

const page = async () => {
    const warrants = await fetchAllWarrants() || [];
    return (
        <>
            <div className="flex justify-between items-center px-3">
                <Heading title="Manage Warrants" />
                <div className="flex gap-4">
                    <WarrantModal />
                </div>
            </div>
            <Separator />
            <DataTable searchKey='name' data={warrants} columns={columns} />
        </>
    )
}

export default page
