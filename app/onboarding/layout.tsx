import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const dashboardUrl = '/dashboard';

  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect(dashboardUrl)
  }

  return <>{children}</>
}