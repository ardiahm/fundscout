'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

type OnboardingData = {
  builderType: string | null
  stage: string | null
  industries: string[] | null
  goals: string[] | null
}

export const completeOnboarding = async (data: OnboardingData) => {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    return { message: 'No Logged In User' }
  }

  const client = await clerkClient()

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        ...data,
      },
    })
    return { message: res.publicMetadata }
  } catch (err) {
    return { error: 'There was an error updating the user metadata.' }
  }
}