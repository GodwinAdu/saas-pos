
import { currentUser } from '@/lib/helpers/current-user'
import React from 'react'
import { fetchAllBranches } from '@/lib/actions/branch.actions'
import { currentBranch } from '@/lib/helpers/current-branch';
import { fetchAllProducts } from '@/lib/actions/product.actions'
import PosContent from '@/components/pos/pos-content'
import { fetchSuspendForUser } from '@/lib/actions/suspend.actions';


const page = async ({ params }: { params: BranchIdParams }) => {
  const { branchId } = await params;
  const user = await currentUser();
  if (!user) {
    // Handle the case when the user is not authenticated
    return <div>Please log in to access this page.</div>
  }
  const suspends = await fetchSuspendForUser(branchId);
  const branches = await fetchAllBranches()
  const branch = await currentBranch(branchId);
  const products = await fetchAllProducts() || [];
  console.log(suspends,'suspends');

  return (
    <>
      <PosContent branch={branch} user={user} branches={branches} products={products} suspends={suspends} />
    </>
  )
}

export default page
