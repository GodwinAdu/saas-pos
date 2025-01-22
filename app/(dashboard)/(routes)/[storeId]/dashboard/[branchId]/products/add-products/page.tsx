import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { fetchAllUnits } from '@/lib/actions/unit.actions'
import { fetchAllBrands } from '@/lib/actions/brand.actions'
import { fetchAllCategories } from '@/lib/actions/category.actions'
import { currentBranch } from '@/lib/helpers/current-branch'
import { fetchAllBranches } from '@/lib/actions/branch.actions'
import { currentUser } from '@/lib/helpers/current-user'
import { fetchAllWarrants } from '@/lib/actions/warrant.actions'
import { fetchAllVariations } from '@/lib/actions/variation.actions'
import CreateProductForm from './_components/CreateProduct'

const page = async ({ params }: { params: BranchIdParams }) => {

  const { branchId } = await params;
  const user = await currentUser();
  const units = await fetchAllUnits() || [];
  const brands = await fetchAllBrands() || [];
  const categories = await fetchAllCategories() || [];
  const branch = await currentBranch(branchId);
  const branches = await fetchAllBranches() || [];
  const warrants = await fetchAllWarrants() || [];
  const variations = await fetchAllVariations() || [];
  return (
    <>
      <div className="">
        <Heading
          title="Add New Product"
        />
      </div>
      <Separator />
      <div className="">
        <CreateProductForm
          user={user}
          warrants={warrants}
          variations={variations}
          branches={branches}
          branch={branch}
          brands={brands}
          categories={categories}
          units={units}
          type='create'
        />
      </div>
    </>
  )
}

export default page
