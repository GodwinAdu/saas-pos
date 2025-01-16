import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import { currentBranch } from '@/lib/helpers/current-branch';
import { currentUser } from '@/lib/helpers/current-user';
import React from 'react'
import CreateSaleForm from '../_components/CreateSaleForm';
import { fetchAllAccounts } from '@/lib/actions/account.acctions';


const page = async ({ params }: { params: BranchIdParams }) => {

    const { branchId } = await params;
    const user = await currentUser();
    const branch = await currentBranch(branchId);
    const accounts = await fetchAllAccounts();

    return (
        <div className='space-y-2'>
            <div className="">
                <Heading
                    title="Add New Sale"
                />
            </div>
            <Separator />
            <div className="py-4">
                <CreateSaleForm branch={branch} accounts={accounts} />
            </div>
        </div>
    )
}

export default page
