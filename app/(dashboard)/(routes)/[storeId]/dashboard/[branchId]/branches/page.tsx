import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import BranchSettingsForm from './_components/BranchSettings'
import { currentBranch } from '@/lib/helpers/current-branch'
import BranchSettings from '@/components/branch-settings/branch-settings'
import { BranchIdParams } from '@/lib/types'
import Branch from '../../../../../../../lib/models/branch.models';

const page = async ({ params }: { params: BranchIdParams }) => {
  const { branchId } = await params;
  const branch = await currentBranch(branchId as string)
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title="Branch Settings"
        />
      </div>
      <Separator />
      <div className="py-4">
        <BranchSettings branch={branch} />
        {/* <BranchSettingsForm branch={branch} /> */}
      </div>
    </>
  )
}

export default page
