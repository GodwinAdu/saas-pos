import Footer from '@/components/commons/Footer';
import Home from '@/components/commons/Home';
import Navbar from '@/components/commons/Navbar';
import useBranchStore from '@/hooks/use-branch-store';
import { fetchRole } from '@/lib/actions/role.actions';
import { currentUser } from '@/lib/helpers/current-user';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';


const Page = async () => {
  const user: IUser = await currentUser();

  const { activeBranch } = useBranchStore.getState(); // Access Zustand store directly

  if (user) {
    // Redirect to the active branch if it exists and the user has access
    if (activeBranch && user.accessLocation.includes(activeBranch._id)) {
      redirect(`/${user.storeId}/dashboard/${activeBranch._id}`);
    }

    // Redirect to the first accessible location
    redirect(`/${user.storeId}/dashboard/${user.accessLocation[0]}`);
  }

  return (
    <>
    <Home />
    </>
  );
};

export default Page;

