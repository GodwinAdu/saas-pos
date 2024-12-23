
import Home from '@/components/commons/Home';
import useBranchStore from '@/hooks/use-branch-store';
import { currentUser } from '@/lib/helpers/current-user';
import { redirect } from 'next/navigation';

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

