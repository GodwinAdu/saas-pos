import { InitialModal } from "@/components/modals/initial-modal";
import useBranchStore from "@/hooks/use-branch-store";
import { fetchRole } from "@/lib/actions/role.actions";
import { currentUser } from "@/lib/helpers/current-user";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { storeId: string } }) => {
  const { activeBranch } = useBranchStore.getState();
  const user = await currentUser();

  if (!user) {
    console.warn("No user found, redirecting to home.");
    redirect("/"); // Redirect unauthenticated users
  }

  let userRole;
  try {
    userRole = await fetchRole(user.role);
    if (!userRole) {
      console.error("User role not found, throwing error.");
      throw new Error("User role not found");
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
    redirect("/error"); // Redirect to an error page
  }

  if (user.accessLocation.length === 0) {
    if (userRole.displayName === "admin") {
      return <InitialModal />;
    } else {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center space-y-4 p-4">
            <h2 className="text-2xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground">
              You are not authorized to access this page. Contact your manager to create a branch and grant you access.
            </p>
          </div>
        </div>
      );
    }
  }

  if (activeBranch && user.accessLocation.includes(activeBranch._id)) {
    redirect(`/${params.storeId}/dashboard/${activeBranch._id}`);
  } else {
    redirect(`/${params.storeId}/dashboard/${user.accessLocation[0]}`);
  }


  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin mx-auto" />
        <p className="text-green-700">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default page;
