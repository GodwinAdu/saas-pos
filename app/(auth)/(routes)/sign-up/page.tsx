import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SignupForm from './_components/SignupForm'

const page = () => {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid gap-6 px-4">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign Up <span className='text-green-700 font-extrabold underline'>POS</span>ify</h1>
            <p className="text-balance text-muted-foreground">
              Enter your details below to register your account
            </p>
          </div>
          <div>
            <SignupForm />
          </div>
          <div className="text-xs text-center">
            <p className='font-extrabold underline text-red-500'>Development Mode, <span className='text-green-600 '>V 0.0.1</span></p>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/sign-up.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

export default page
