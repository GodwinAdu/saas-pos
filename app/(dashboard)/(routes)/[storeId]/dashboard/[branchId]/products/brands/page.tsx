
import { Separator } from '@/components/ui/separator'
import { BrandModal } from './_components/BrandModal'
import { columns } from './_components/column'
import { fetchBrandWithBranchId } from '@/lib/actions/brand.actions'
import Heading from '@/components/commons/Header'
import { DataTable } from '@/components/table/data-table'
import { fetchAllBranches } from '@/lib/actions/branch.actions'
import { currentUser } from '@/lib/helpers/current-user'

const page = async () => {
    const user  = await currentUser() // Assuming currentUser is a function that fetches the current user's information
    const data = await fetchBrandWithBranchId() || [];
    const branches = await fetchAllBranches() || [];
    return (
        <>
            <div className="flex justify-between items-center px-3">
                <Heading title="Manage Brands" />
                <div className="flex gap-4">
                    <BrandModal branches={branches} user={user} />
                </div>
            </div>
            <Separator />
            <DataTable searchKey='name' data={data} columns={columns} />
        </>
    )
}

export default page
