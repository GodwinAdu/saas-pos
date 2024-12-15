import { AlertTriangle, Mail, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-red-600">Account Banned</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            We&apos;re sorry, but your account has been banned from our platform.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Possible reasons for account ban:</h3>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              <li>Violation of our terms of service</li>
              <li>Engaging in abusive or harmful behavior</li>
              <li>Multiple reports from other users</li>
              <li>Suspicious or fraudulent activity</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">What you can do:</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Review our terms of service</li>
              <li>Contact our support team for more information</li>
              <li>Appeal the ban if you believe it&apos;s a mistake</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" variant="outline">
            <Mail className="mr-2 h-4 w-4" /> Contact Support
          </Button>
          <Link href="/appeal" className="w-full">
            <Button className="w-full">
              Appeal Ban <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

