
import { Separator } from '@/components/ui/separator'
import { fetchAllCategories } from '@/lib/actions/category.actions'
import { fetchAllBrands } from '@/lib/actions/brand.actions'



    ;
import CreateProductForm from '../_components/CreateProduct';
import Heading from '@/components/commons/Header';
import { currentUser } from '@/lib/helpers/current-user';
import { fetchAllBranches, fetchBranchById } from '@/lib/actions/branch.actions';
import { fetchAllProductById } from '@/lib/actions/product.actions';
import { fetchAllWarrants } from '@/lib/actions/warrant.actions';
import { fetchAllVariations } from '@/lib/actions/variation.actions';
import { fetchAllUnits } from '@/lib/actions/unit.actions';

type ProductProps = Promise<{ productId: string, branchId: string }>
const page = async ({ params }: { params: ProductProps }) => {
    const user = await currentUser()
    const { productId, branchId } = await params;
    const initialData = await fetchAllProductById(productId);
    const categories = await fetchAllCategories() || [];
    const brands = await fetchAllBrands() || [];
    const branch = await fetchBranchById(branchId)
    const branches = await fetchAllBranches() || [];
    const warrants = await fetchAllWarrants() || [];
    const variations = await fetchAllVariations() || [];
    const units = await fetchAllUnits() || [];

    return (
        <>
            <Heading title='Update Product' />
            <Separator />
            <div className="py-6">
                <CreateProductForm
                    user={user}
                    warrants={warrants}
                    variations={variations}
                    branches={branches}
                    branch={branch}
                    brands={brands}
                    categories={categories}
                    units={units}
                    initialData={initialData}
                    type='update'
                />

            </div>

        </>
    )
}

export default page
