import { prisma } from "../../lib/prisma";
import type {
  OneLinerInteraction,
  OneLinerResponse,
} from "@/backend/types/oneliner";

export async function getUsersOneLinerHistory(
  userId: string,
): Promise<OneLinerInteraction[]> {
  const oneLinerHistory = await prisma.oneLinerHistory.findUnique({
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
    oneLinerHistory?.interactions.map((interaction) => ({
      ...interaction,
      response: interaction.response as OneLinerResponse,
    })) ?? []
  );
}