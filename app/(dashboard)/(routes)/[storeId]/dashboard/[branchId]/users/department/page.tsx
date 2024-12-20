import Heading from '@/components/commons/Header'
import React from 'react'
import { DepartmentModal } from './_components/DepartmentModal'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/table/data-table'
import { columns } from './_components/column'
import { fetchAllDepartments } from '@/lib/actions/department.actions'
import DepartmentTable from './_components/DepartmentTable'


// type Params = Promise<{ branchId: string }>
const page = async () => {


  const data = await fetchAllDepartments() || [];
 

  const filterOptions = [
    {
      id: "stock",
      label: "Stock Status",
      options: [
        { value: "all", label: "All Products" },
        { value: "inStock", label: "In Stock" },
        { value: "outOfStock", label: "Out of Stock" },
      ],
    }
  ];
  return (
    <>
      <div className="flex justify-between items-center px-3">
        <Heading title="Manage Department" />
        <div className="flex gap-4">
          <DepartmentModal />
        </div>
      </div>
      <Separator />
      <DepartmentTable data={data} />
    </>
  )
}

export default page
