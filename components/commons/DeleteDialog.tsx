"use client"

import React, {  MouseEventHandler } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,

} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";


type DeleteDialogProps = {
    id: string;
    title: string;
    description: string;
    isDeleteDialogOpen: boolean;
    onCancel: MouseEventHandler<HTMLButtonElement>;
    onContinue: (data: string) => void;
};

export function DeleteDialog({
    id,
    title,
    description,
    isDeleteDialogOpen,
    onCancel,
    onContinue,
}: DeleteDialogProps) {
    return (
        <AlertDialog open={isDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                    <Button variant="destructive" size="sm" onClick={() => onContinue(id)}>Continue</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

