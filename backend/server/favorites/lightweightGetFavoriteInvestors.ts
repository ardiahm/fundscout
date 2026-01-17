import dotenv from "dotenv";
import { prisma } from "../../lib/prisma";

export async function lightweightGetFavoriteInvestors(userId: string) {
  const favorites = await prisma.favoriteInvestor.findMany({
    where: { userId },
    select: {
      investorId: true,
    },
  });

  return new Set(favorites.map((f) => f.investorId));
}

