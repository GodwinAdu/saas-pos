'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link'

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: (Error & { digest?: string }) | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return this.renderErrorUI()
        }

        return this.props.children
    }

    private renderErrorUI() {
        return (
            <div className="flex h-full w-full items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <span>An Error Occurred</span>
                        </CardTitle>
                        <CardDescription>
                            We apologize for the inconvenience. An unexpected error has occurred.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error Details</AlertTitle>
                            <AlertDescription className="mt-2">
                                {this.state.error?.message || "An unknown error occurred."}
                                {this.state.error?.digest && (
                                    <p className="mt-2 text-xs">
                                        Error ID: <code className="text-muted-foreground">{this.state.error?.digest}</code>
                                    </p>
                                )}
                            </AlertDescription>
                        </Alert>
                        <p className="text-sm text-muted-foreground">
                            If this error persists, please contact our support team and provide the Error ID above.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="w-full"
                            variant="default"
                        >
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Return to Home
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }
}

