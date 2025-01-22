"use client"


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash } from "lucide-react"
import { useState } from "react"

type DeleteDialogProps = {
    id: string
    title: string
    description: string
    onContinue: (data: string) => void
}

export function DeleteDialog({ id, title, description, onContinue }: DeleteDialogProps) {
    const [open, setOpen] = useState(false)

    const handleContinue = () => {
        onContinue(id)
        setOpen(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger  asChild>
                <button className="flex gap-2 hover:text-black w-full text-white">
                    <Trash className="mr-2 h-4 w-4" />  Delete
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-800" onClick={handleContinue}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

