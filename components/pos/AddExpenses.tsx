
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon, } from "lucide-react"

const AddExpensesModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><PlusIcon /> Add Expenses</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[90%]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

      </DialogContent>
    </Dialog>
  )
}

export default AddExpensesModal
