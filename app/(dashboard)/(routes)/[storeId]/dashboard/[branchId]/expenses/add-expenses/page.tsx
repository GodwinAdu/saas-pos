import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import ExpenseForm from './_components/ExpensesForm'

const page = () => {
  return (
    <>
      <div className="flex justify-between items-center px-3">
        <Heading title="Expenses" />
        <div className="flex gap-4">
          {/* <ExpensesCategoriesModal user={user} branches={branches} /> */}
        </div>
      </div>
      <Separator /> 
      <ExpenseForm />
    </>
  )
}

export default page
