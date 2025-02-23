
import { currentUser } from '@/lib/helpers/current-user'
import React from 'react'
import { fetchBranchesForUser } from '@/lib/actions/branch.actions'
import { currentBranch } from '@/lib/helpers/current-branch';
import PosContent from '@/components/pos/pos-content'
import { fetchSuspendForUser } from '@/lib/actions/suspend.actions';
import { fetchAllBrandsForPos } from '@/lib/actions/brand.actions';
import { fetchAllCategoriesForPos } from '@/lib/actions/category.actions';
import { getCurrencySymbol} from '@/lib/settings/store.settings';


const page = async ({ params }: { params: BranchIdParams }) => {
  const { branchId } = await params;
  const user = await currentUser();
  if (!user) {
    // Handle the case when the user is not authenticated
    return <div>Please log in to access this page.</div>
  }
  const suspends = await fetchSuspendForUser(branchId);
  const branches = await fetchBranchesForUser() || [];
  const branch = await currentBranch(branchId);
  // const products = await fetchAllProductsForPos() || [];
  const brands = await fetchAllBrandsForPos() || [];
  const categories = await fetchAllCategoriesForPos() || [];
  const currency = await getCurrencySymbol();
  // const methods = await paymentMethods();


  return (
    <>
      <PosContent
        currency={currency}
        brands={brands}
        categories={categories}
        branch={branch}
        user={user}
        branches={branches}
        suspends={suspends}
      />
    </>
  )
}

export default page
