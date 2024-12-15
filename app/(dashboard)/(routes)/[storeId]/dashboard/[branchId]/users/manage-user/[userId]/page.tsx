
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { fetchUser } from '@/lib/actions/user.actions'
import Heading from '@/components/commons/Header'
import { POSUserRegistrationForm } from '../_components/form/pos-user-registration-form'
import { getAllRoles } from '@/lib/actions/role.actions'
import { fetchAllBranches } from '@/lib/actions/branch.actions'
import { fetchAllDepartments } from '@/lib/actions/department.actions'
import { currentUser } from '@/lib/helpers/current-user'

const page = async ({ params }: { params: { userId: string } }) => {
    const user = await currentUser()
    const data = await fetchUser(params.userId as string)
    const roles = await getAllRoles() || [];
    const branches = await fetchAllBranches() || [];
    const departments = await fetchAllDepartments() || [];
    return (
        <>
            <Heading title='Update User' />
            <Separator />
            <div className="py-6">
                <POSUserRegistrationForm currentUser={user} roles={roles} branches={branches} departments={departments} initialData={data} type="update" />
            </div>
        </>
    )
}

export default page
