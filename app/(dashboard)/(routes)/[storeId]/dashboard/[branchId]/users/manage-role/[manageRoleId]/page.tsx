
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import DisplayRole from "../_component/DisplayRole";
import { fetchRoleById } from "@/lib/actions/role.actions";
import Heading from "@/components/commons/Header";
import { currentUser } from "@/lib/helpers/current-user";

export const dynamic = "force-dynamic"

const page = async ({ params }: { params: { storeId: string, branchId: string } }) => {
    const user = await currentUser();

    if(!user){
        redirect("/")
    }
    const id = params.branchId;
    const pathId = params.adminId

    console.log(id)

    const initialData = await fetchRoleById({id}) || {}
   

  return (
    <>
       <div className="flex justify-between items-center">
        <Heading
          title="Role Details"
          description="Explore the role content"
        />

        <Link
          href={`/${params.storeId}/dashboard/${params.branchId}/users/manage-role`}
          className={cn(buttonVariants())}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </div>
      <Separator />
      <DisplayRole initialData={initialData} />
    </>
  )
}

export default page
