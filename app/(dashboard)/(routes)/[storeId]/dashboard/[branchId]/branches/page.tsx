import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import BranchSettingsForm from './_components/BranchSettings'
import { currentBranch } from '@/lib/helpers/current-branch'

const page = async ({ params }: { params: { branchId: string } }) => {
  const branch = await currentBranch(params.branchId as string)
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title="Branch Settings"
        />
      </div>
      <Separator />
      <div className="py-4">
        <BranchSettingsForm branch={branch} />
      </div>
    </>
  )
}

export default page
