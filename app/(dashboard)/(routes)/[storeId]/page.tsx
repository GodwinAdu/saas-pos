'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InitialModal } from "@/components/modals/initial-modal";
import useBranchStore from "@/hooks/use-branch-store";
import { fetchRole } from "@/lib/actions/role.actions";
import { currentUser } from "@/lib/helpers/current-user";
import { DashboardLoader } from './_components/dashboard-loader';
import { AccessDenied } from './_components/access-denied';
import { ErrorBoundary } from './_components/error-boundary';

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  interface User {
    id: string;
    role: string;
    accessLocation: string[];
    // Add other properties as needed
  }

  const [user, setUser] = useState<User | null>(null);
  interface UserRole {
    displayName: string;
    // Add other properties as needed
  }

  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();
  const params = useParams();
  const { activeBranch } = useBranchStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUserData = await currentUser();
        setUser(currentUserData);

        if (!currentUserData) {
          console.warn("No user found, redirecting to home.");
          router.push('/');
          return;
        }

        const userRoleData = await fetchRole(currentUserData.role);
        setUserRole(userRoleData);

        if (!userRoleData) {
          throw new Error("User role not found");
        }

        if (currentUserData.accessLocation.length === 0) {
          setIsLoading(false);
          return;
        }

        if (activeBranch && currentUserData.accessLocation.includes(activeBranch._id)) {
          window.location.href = `/${params.storeId}/dashboard/${activeBranch._id}`;
        } else {
          window.location.href = `/${params.storeId}/dashboard/${currentUserData.accessLocation[0]}`;
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.storeId, activeBranch, router]);

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (error) {
    throw error; // This will be caught by the ErrorBoundary
  }

  if (user && user.accessLocation.length === 0) {
    return userRole && userRole.displayName === "admin" ? <InitialModal /> : <AccessDenied />;
  }

  // This return statement should never be reached due to the redirects,
  // but we'll keep it as a fallback for TypeScript
  return null;
};

const Page = () => (
  <ErrorBoundary>
    <DashboardPage />
  </ErrorBoundary>
);

export default Page;

