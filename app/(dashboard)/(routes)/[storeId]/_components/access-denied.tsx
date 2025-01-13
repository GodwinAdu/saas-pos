import { AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export const AccessDenied = () => (
    <div className="flex h-full w-full items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Access Denied</span>
                </CardTitle>
                <CardDescription>
                    You do not have the necessary permissions to access this page.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    This could be due to one of the following reasons:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Your account has not been assigned to any branch</li>
                    <li>Your role does not have the required permissions</li>
                    <li>There might be an issue with your account settings</li>
                </ul>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <Button asChild className="w-full">
                    <Link href="/support">Contact Support</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/">Return to Home</Link>
                </Button>
            </CardFooter>
        </Card>
    </div>
)
