import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server'

const isOnboardingRoute = createRouteMatcher(['/onboarding'])
const isPublicRoute = createRouteMatcher(['/'])
const isSignInRoute = createRouteMatcher(['/sign-in'])
const isSignUpRoute = createRouteMatcher(['/sign-up'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // authenticated == signed in
  const { isAuthenticated, sessionClaims, redirectToSignIn } = await auth()

  // if user is auth and is visiting /onboarding, don't redirect
  if (isAuthenticated && isOnboardingRoute(req)) {
    return NextResponse.next()
  }
  
  // if the user isn't auth in and the route is private, redirect to sign-in
  if (!isAuthenticated && !isPublicRoute(req)) {
    return redirectToSignIn({returnBackUrl: req.url})
  }

  // if user is authed but onboardingComplete = false, redirect them to /onboarding
  if (isAuthenticated && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  // if user is auth and route is protected, let them view
  if (isAuthenticated && !isPublicRoute(req)) {
    return NextResponse.next()
  }

  if (isAuthenticated && isSignInRoute(req)) {
    const dashboardUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(dashboardUrl);
  }

  if (isAuthenticated && isSignUpRoute(req)) {
    const dashboardUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(dashboardUrl);
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};