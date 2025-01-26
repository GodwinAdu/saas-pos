import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import ExpenseForm from './_components/ExpensesForm'
import { fetchAllAccounts } from '@/lib/actions/account.acctions'
import { fetchAllExpensesCategoriesWithBranchId } from '@/lib/actions/expenses-category.actions'

const page = async () => {
  const accounts = await fetchAllAccounts() || [];
  const categories = await fetchAllExpensesCategoriesWithBranchId() || [];
  return (
    <>
      <div className="flex justify-between items-center px-3">
        <Heading title="Expenses" />
      </div>
      <Separator /> 
      <ExpenseForm accounts={accounts} categories={categories} />
    </>
  )
}

export default page
