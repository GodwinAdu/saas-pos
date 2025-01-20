"use client"

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { updateStore } from '@/lib/actions/store.actions'
import { playErrorSound, playSuccessSound } from '@/lib/audio'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const DangerZone = ({ store }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [showDeactivateConfirmation, setShowDeactivateConfirmation] = useState(false)

    // const router = useRouter()
    // const storeId = store._id
    // const defaultValues: Partial<StoreFormValues> = store ?? {
    //     name: "",
    //     avatar: null,
    //     storeEmail: "",
    //     storePhone: null,
    //     storeAddress: null,
    //     autoDeleteTrash: true,
    // }

    // const form = useForm<StoreFormValues>({
    //     resolver: zodResolver(storeFormSchema),
    //     defaultValues,
    // })

    // async function onSubmit(data: StoreFormValues) {
    //     setIsLoading(true)
    //     try {
    //         await updateStore(storeId, data)
    //         playSuccessSound()
    //         router.refresh()
    //         toast({
    //             title: "Settings updated successfully",
    //             description: "Your store settings have been saved.",
    //             variant: "success",
    //         })
    //     } catch {
    //         playErrorSound()
    //         toast({
    //             title: "Error",
    //             description: "An error occurred while saving your settings.",
    //             variant: "destructive",
    //         })
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }
    return (
                <div className="space-y-6">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            The actions in this section can have severe consequences. Proceed with extreme caution.
                        </AlertDescription>
                    </Alert>
                    <div className="grid gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-semibold mb-2">Deactivate Store</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Temporarily disable this branch. This will prevent any new orders or operations.
                                </p>
                                <Button variant="outline" onClick={() => setShowDeactivateConfirmation(true)}>
                                    Deactivate Branch
                                </Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-semibold mb-2">Delete Store</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Permanently delete this branch and all associated data. This action cannot be undone.
                                </p>
                                <Button variant="destructive" onClick={() => setShowDeleteConfirmation(true)}>
                                    Delete Branch
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

    )
}

export default DangerZone