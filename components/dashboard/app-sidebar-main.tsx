import React from 'react'
import { AppSidebar } from './app-sidebar'
import { getStore } from '@/lib/actions/store.actions'
import { fetchBranchesForUser } from '@/lib/actions/branch.actions';
import { currentUserRole } from '@/lib/helpers/get-user-role';
import { IRole } from '@/lib/types';

const AppSidebarMain = async () => {
    const store = await getStore();

    const branches = await fetchBranchesForUser() || [];

    const userRole = await currentUserRole();

    return (
        <>
            <AppSidebar userRole={userRole as IRole} store={store} branches={branches} />
        </>
    )
}

export default AppSidebarMain
