
import { currentUser } from '@/lib/helpers/current-user'
import React from 'react'
import { fetchAllBranches } from '@/lib/actions/branch.actions'
import { currentBranch } from '@/lib/helpers/current-branch';
import { fetchAllProducts } from '@/lib/actions/product.actions'
import PosContent from '@/components/pos/pos-content'

type Params = {
  params: {
    branchId: string,  // From the router params, e.g., '/branches/:branchId'
  }
}
const page = async ({ params }: Params) => {
  const { branchId } = await params;
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
