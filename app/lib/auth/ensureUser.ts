import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../backend/lib/prisma";
import { BuilderType, ProjectStage } from "../../../backend/lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";

export async function ensureUser() {
  const { userId, sessionClaims } = await auth();

  if (!userId) return null;

  const metadata = sessionClaims?.metadata as
    | {
        onboardingComplete?: boolean;
        builderType?: BuilderType;
        stage?: ProjectStage;
        industries?: string[];
        goals?: string[];
      }
    | undefined;

  // if user exists under this userId, find user in prisma
  const prismaUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  // if user doesn't exist, create new user in prisma
  if (!prismaUser) {
    return prisma.user.create({
      data: {
        clerkUserId: userId,
        onboardingComplete:
          sessionClaims?.metadata?.onboardingComplete ?? false,
        builderType: metadata?.builderType,
        stage: metadata?.stage,
        industries: metadata?.industries,
        goals: metadata?.goals,
      },
    });
  }

  // return user object
  return prismaUser;
}
