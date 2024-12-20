"use client"

import { DataTable } from '@/components/table/data-table';
import React, { useState } from 'react'
import { columns } from './column';


const DepartmentTable = ({data}) => {
  
    
  return (
    <DataTable
    searchKey='name'
      columns={columns}
      data={data}
    />
  )
}

export default DepartmentTable
