

import { Separator } from '@/components/ui/separator'
import { CategoryModal } from './_components/CategoryModal'
import { columns } from './_components/column'
import { fetchAllCategoriesWithBranchId } from '@/lib/actions/category.actions'
import Heading from '@/components/commons/Header'
import { DataTable } from '@/components/table/data-table'
import { fetchAllBranches } from '@/lib/actions/branch.actions'
import { currentUser } from '@/lib/helpers/current-user'

const page = async () => {
    const user  = await currentUser() // Assuming currentUser is a function that fetches the current user's information
    const data = await fetchAllCategoriesWithBranchId() || [];
    const branches = await fetchAllBranches() || [];
    return (
        <>
            <div className="flex justify-between items-center px-3">
                <Heading title="Manage Categories" />
                <div className="flex gap-4">
                    <CategoryModal branches={branches} user={user} />
                </div>
            </div>
            <Separator />
            <DataTable searchKey='name' data={data} columns={columns} />
        </>
    )
}

export default page
