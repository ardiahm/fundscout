import { prisma } from "../../lib/prisma";
import type {
  OutreachInteraction,
  GeneratedOutreach,
} from "@/backend/types/outreach";

export async function getUsersOutreachHistory(
  userId: string,
): Promise<OutreachInteraction[]> {
  const outreachHistory = await prisma.outreachHistory.findUnique({
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
    outreachHistory?.interactions.map((interaction) => ({
      ...interaction,
      response: interaction.response as GeneratedOutreach,
    })) ?? []
  );
}
