
import { currentUser } from '@/lib/helpers/current-user'
import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { fetchAllBranches } from '@/lib/actions/branch.actions'
import { currentBranch } from '@/lib/helpers/current-branch';
import { fetchAllProducts } from '@/lib/actions/product.actions'
import PosContent from '@/components/pos/pos-content'

export const dynamicParams = true
export const revalidate = 0
const page = async ({ params }: { params: { branchId: string } }) => {
  const branchId = params.branchId as string;
  const user = await currentUser();
  const branches = await fetchAllBranches()
  if (!user) {
    // Handle the case when the user is not authenticated
    return <div>Please log in to access this page.</div>
  }
  const branch = await currentBranch(branchId);
  const products = await fetchAllProducts() || [];
  console.log(products);
 
  return (
    <>
      <PosContent branch={branch} user={user} branches={branches} products={products} />
    </>
  )
}

export default page
