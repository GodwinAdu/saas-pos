
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import LoginForm from './_component/LoginForm'

const page = () => {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign In <span className='text-green-700 font-extrabold underline'>POS</span>ify</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <LoginForm />
          <div className="text-xs text-center">
            <p className='font-extrabold underline text-red-500'>Development Mode, <span className='text-green-600 '>V 0.0.1</span></p>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
          <div className=" text-center text-sm">
            <Link href="/forgot-password" className="underline">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/sales.jpg"
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
