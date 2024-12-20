
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { columns } from './_components/column'
import Heading from '@/components/commons/Header'
import { DataTable } from '@/components/table/data-table'
import { fetchAllUsers } from '@/lib/actions/user.actions'
import { fetchAllDepartments } from '@/lib/actions/department.actions'

const page = async () => {
  const data = await fetchAllUsers() || [];
  const departments = await fetchAllDepartments() || [];
  return (
    <>
      <div className="flex justify-between items-center px-3">
        <Heading title="Manage Users" />
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`manage-user/create`} className={cn(buttonVariants({ size: "sm" }), "h-7 gap-1")}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add User
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Separator />
      <div className="">
        <DataTable searchKey='fullName' columns={columns} data={data} />
        {/* <UserGrid departments={departments} /> */}
      </div>
    </>
  )
}

export default page
