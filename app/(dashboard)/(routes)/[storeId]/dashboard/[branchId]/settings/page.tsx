import Heading from '@/components/commons/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import StoreSettingsForm from './_components/StoreSettingsForm'
import { fetchStoreById } from '@/lib/actions/store.actions'

const page = async ({ params }: { params: { storeId: string } }) => {
  const storeId = await params.storeId as string;
  const store = await fetchStoreById(storeId) as IStore;
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title="Store Settings"
        />
      </div>
      <Separator />
      <div className="py-4">
        <StoreSettingsForm store={store}  />
      </div>
    </>
  )
}

export default page
