
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pause, PlusIcon, ShoppingCartIcon } from "lucide-react"

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
          Make changes to your profile here. Click save when youre done.
        </DialogDescription>
      </DialogHeader>
     
    </DialogContent>
  </Dialog>
  )
}

export default AddExpensesModal
