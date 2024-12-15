
import { Separator } from '@/components/ui/separator'
import { fetchAllCategories } from '@/lib/actions/category.actions'
import { fetchAllBrands } from '@/lib/actions/brand.actions'



    ;
import CreateProductForm from '../_components/CreateProduct';
import Heading from '@/components/commons/Header';
const page = async ({ params }: { params: { productId: string } }) => {
    const initialData = {}
    const categories = await fetchAllCategories() || [];
    const brands = await fetchAllBrands() || [];

    return (
        <>
            <Heading title='Create Product' />
            <Separator />
            <div className="py-6">
                <CreateProductForm type='update' initialData={initialData} categories={categories} brands={brands} />
            </div>

        </>
    )
}

export default page
