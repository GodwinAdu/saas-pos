"use client"

import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from 'react'

export const DashboardLoader = () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="flex h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading Dashboard</span>
                    </CardTitle>
                    <CardDescription className="text-center">
                        Please wait while we prepare your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Progress value={progress} className="w-full" />
                    <ul className="space-y-2">
                        <li className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm">Fetching user data...</span>
                        </li>
                        <li className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm">Loading branch information...</span>
                        </li>
                        <li className="flex items-center opacity-50">
                            <Loader2 className="h-4 w-4 mr-2" />
                            <span className="text-sm">Preparing dashboard components...</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

