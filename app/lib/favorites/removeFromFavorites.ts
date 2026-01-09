import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../backend/lib/prisma";
import { redirect } from "next/navigation";
import { User } from "@/backend/lib/generated/prisma/client";

type Props = {
  investorId: number;
  user: User;
};

export async function removeFromFavorites({ investorId, user }: Props) {
  // lightweight clerk auth
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // find prisma user
  const prismaUser = await prisma.user.findUnique({
    where: { clerkUserId: user.clerkUserId },
    select: { id: true },
  });

  // get prismaUserId
  const prismaUserId = prismaUser!.id;

  // create new row in favoriteInvestor for that prismaUserId and passed investorId
  await prisma.favoriteInvestor.delete({
    where: {
      userId_investorId: {
        userId: prismaUserId,
        investorId,
      },
    },
  });
}
