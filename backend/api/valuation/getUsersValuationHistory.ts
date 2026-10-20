import { prisma } from "../../lib/prisma";
import type {
  ValuationInteraction,
  ValuationResult,
} from "@/backend/types/valuation";

export async function getUsersValuationHistory(
  userId: string,
): Promise<ValuationInteraction[]> {
  const valuationHistory = await prisma.valuationHistory.findUnique({
    where: { userId },
    select: {
      interactions: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          response: true,
          createdAt: true,
          submission: true,
        },
      },
    },
  });

  return (
    valuationHistory?.interactions.map((interaction) => ({
      ...interaction,
      response: interaction.response as ValuationResult,
    })) ?? []
  );
}
