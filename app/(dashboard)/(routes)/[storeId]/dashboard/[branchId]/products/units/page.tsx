import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { UnitModal } from './_components/UnitModal'
import { DataTable } from '@/components/table/data-table'
import { columns } from './_components/column'
import { fetchAllUnitsByBranchId } from '@/lib/actions/unit.actions'
import { fetchAllBranches } from '@/lib/actions/branch.actions'
import { currentUser } from '@/lib/helpers/current-user'

const page = async () => {
  const user = await currentUser()
  const data = await fetchAllUnitsByBranchId() || [];
  const branches = await fetchAllBranches() || [];

  return (
    <>
      <div className="flex justify-between items-center px-3">
        <Heading title="Manage Units" />
        <div className="flex gap-4">
          <UnitModal branches={branches} user={user} />
        </div>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
    </>
  )
}

export default page
