import Heading from '@/components/commons/Header'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { currentUserRole } from '@/lib/helpers/get-user-role'
import { cn } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { fetchAllBrands } from '@/lib/actions/brand.actions'
import { fetchAllCategories } from '@/lib/actions/category.actions'
import ProductTable from './_components/ProductTable'

const page = async () => {
  // Fetch the current user's role
  const role = await currentUserRole();
  // Redirect to the homepage if the user has no role
  if (!role) {
    redirect("/")
  }

  // Destructure the 'addRole' permission from the user's role
  const { addProduct } = role;

  const brands = await fetchAllBrands() || [];

  const categories = await fetchAllCategories() || [];

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title="All Products"
        />
        {addProduct && (
          <Link
            href={`add-products/create`}
            className={cn(buttonVariants())}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Product
          </Link>
        )}
      </div>
      <Separator />
      <div className="py-4">
        <ProductTable brands={brands} categories={categories} />
      </div>
    </>
  )
}

export default page
