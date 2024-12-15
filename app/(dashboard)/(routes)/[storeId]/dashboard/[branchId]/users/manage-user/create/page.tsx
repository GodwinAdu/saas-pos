
import { Separator } from '@/components/ui/separator'
import React from 'react'
import Heading from '@/components/commons/Header'
import { POSUserRegistrationForm } from '../_components/form/pos-user-registration-form'
import { getAllRoles } from '@/lib/actions/role.actions'
import { fetchAllBranches } from '@/lib/actions/branch.actions'
import { fetchAllDepartments } from '@/lib/actions/department.actions'
import { currentUser } from '@/lib/helpers/current-user'


const page = async () => {
    const user = await currentUser()

    const roles = await getAllRoles() || [];
    const branches = await fetchAllBranches() || [];
    const departments = await fetchAllDepartments() || [];
    return (
        <>
            <Heading title='Create New User' />
            <Separator />
            <div className="py-6">
                <POSUserRegistrationForm currentUser={user} roles={roles} branches={branches} departments={departments} type='create' />
            </div>

        </>
    )
}

export default page
