import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import CreateProductForm from '../_components/CreateProduct'
import { fetchAllUnits } from '@/lib/actions/unit.actions'
import { fetchAllBrands } from '@/lib/actions/brand.actions'
import { fetchAllCategories } from '@/lib/actions/category.actions'
import { currentBranch } from '@/lib/helpers/current-branch'

const page = async ({ params }: { params: { branchId: string } }) => {
    const units = await fetchAllUnits() || [];
    const brands = await fetchAllBrands() || [];
    const categories = await fetchAllCategories() || [];
    const branch = await currentBranch(params.branchId as string);

    console.log(branch,'branch current');

    console.log(units)
    return (
        <>
            <div className="">
                <Heading
                    title="All Products"
                />
            </div>
            <Separator />
            <div className="">
                <CreateProductForm branch={branch} brands={brands} categories={categories} units={units} type='create' />
            </div>
        </>
    )
}

export default page
