"use client"

import { AppSidebar } from "../app/components/site/AppSidebar"
import UnivNavBar from "../app/components/site/UnivNavbar";
import Image from "next/image";
import { SignUp } from "@clerk/nextjs"
import { SignedIn, SignedOut, useUser, UserButton, SignUpButton, SignInButton, SignOutButton} from "@clerk/nextjs"
import Link from "next/link"

export default function Home() {
  const { user, isLoaded } = useUser();



  return (

    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8">
        <h1 className="text-2xl font-semibold mb-2">
          FundScout
        </h1>

        <p className="text-sm text-neutral-400 mb-8">
          Dev landing page — authentication entry point
        </p>

        {/* Signed out users */}
        <SignedOut>
          <div className="flex flex-col gap-3">
            <SignUpButton forceRedirectUrl="/onboarding">
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
            </SignUpButton>

            <SignInButton forceRedirectUrl="/dashboard"/>
          </div>
        </SignedOut>

        {/* Signed in users */}
        <SignedIn>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="w-full rounded-md bg-white text-black py-2 text-center font-medium hover:bg-neutral-200 transition"
            >
              Go to dashboard
            </Link>

            <p className="text-xs text-neutral-500 text-center">
              You are already signed in
            </p>
          </div>
          <SignOutButton />
        </SignedIn>
      </div>
    </main>
  );
}
