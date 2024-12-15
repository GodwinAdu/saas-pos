"use client"

import { fetchBranchesForUser } from "@/lib/actions/branch.actions";
import { currentUserRole } from "@/lib/helpers/get-user-role";
import { useEffect, useState } from "react";

const useClientBranches = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [branches, setBranches] = useState<IBranch[] | []>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      setIsLoading(true);
      const data = await fetchBranchesForUser();
      setBranches(data);
      setIsLoading(false);
    };
    fetchBranches();
  }, []);

  return { branches, isLoading };
  
};

export default useClientBranches;
