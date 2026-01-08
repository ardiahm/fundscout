import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../backend/lib/prisma";
import {
  BuilderType,
  ProjectStage,
} from "../../../backend/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { redirect } from "next/navigation";

export async function ensureUser() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

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

  console.log(prismaUser);

  // if user doesn't exist, create new user in prisma
  if (!prismaUser) {
    console.log("Creating prismaUser")
    return prisma.user.create({
      data: {
        clerkUserId: userId,
        onboardingComplete:
          sessionClaims?.metadata?.onboardingComplete ?? false,
        builderType: metadata?.builderType
          ? (metadata.builderType.toUpperCase() as BuilderType)
          : undefined,

        stage: metadata?.stage
          ? (metadata.stage.toUpperCase() as ProjectStage)
          : undefined,
        industries: metadata?.industries,
        goals: metadata?.goals,
      },
    });
    console.log(prismaUser)
  }

  // return user object
  return prismaUser;
}
