"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../backend/lib/prisma";
import { redirect } from "next/navigation";
import { User } from "@/backend/lib/generated/prisma/client";

type Props = {
  investorId: number;
};

export async function toggleFavoriteInvestor({ investorId }: Props) {
  // lightweight clerk auth
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // find prisma user
  const prismaUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!prismaUser) throw "User not found";

  // get prismaUserId
  const prismaUserId = prismaUser!.id;

  // boolean
  const isExistingFavorite = await prisma.favoriteInvestor.findUnique({
    where: {
      userId_investorId: {
        userId: prismaUserId,
        investorId,
      },
    },
  });

  // if existing, delete; else, create
  if (isExistingFavorite) {
    console.log("removing favorite: " + investorId)
    await prisma.favoriteInvestor.delete({
    where: {
      userId_investorId: {
        userId: prismaUserId,
        investorId,
      },
    },
  });
  } else {
    console.log("adding favorite: " + investorId)
    await prisma.favoriteInvestor.create({
    data: {
        userId: prismaUserId,
        investorId,
    }
  })
  }
}
