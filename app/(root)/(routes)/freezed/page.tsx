"use client"

import { useState } from "react"
import { AlertCircle, Mail, ArrowRight, ShieldAlert } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IdentityVerificationModal } from "@/components/identity-verification-modal"


export default function FrozenPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-blue-600">Account Frozen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Your account has been temporarily frozen for security reasons.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Possible reasons for account freeze:</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Suspicious login activity detected</li>
              <li>Multiple failed login attempts</li>
              <li>Potential security breach</li>
              <li>Incomplete account verification</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Steps to unfreeze your account:</h3>
            <ul className="list-disc list-inside text-green-700 space-y-1">
              <li>Verify your identity</li>
              <li>Update your security settings</li>
              <li>Complete any pending account verification steps</li>
              <li>Contact our support team for assistance</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" variant="outline" onClick={() => setIsModalOpen(true)}>
            <ShieldAlert className="mr-2 h-4 w-4" /> Verify Identity
          </Button>
          <Link href="/support" className="w-full">
            <Button className="w-full">
              Contact Support <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <IdentityVerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

