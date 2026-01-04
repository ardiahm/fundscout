'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import type { OnboardingData } from "./OnboardingClient";



export const completeOnboarding = async (data: Partial<OnboardingData>) => {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    return { message: 'No Logged In User' }
  }

  const client = await clerkClient()

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        onboarding: data,
      },
    })
    console.log("Onboarding complete")
    return { message: res.publicMetadata }
    
  } catch (err) {
    return { error: 'There was an error updating the user metadata.' }
  }
}