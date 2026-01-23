import { prisma } from "@/backend/lib/prisma";
import { unstable_cache } from "next/cache";

export const getInvestorSummariesCached = unstable_cache(
  async () => {
    const investors = await prisma.investor.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        avatarUrl: true,
        websiteUrl: true,
        investments: {
          select: {
            amount: true,
            investedAt: true,
            company: {
              select: { name: true },
            },
          },
          orderBy: { investedAt: "desc" },
        },
      },
    });

    return investors.map((inv) => {
      const investments = inv.investments;

      const totalInvestments = investments.length;

      const investmentsWithAmount = investments.filter(
        (i) => i.amount !== null
      );

      const averageInvestmentSize =
        investmentsWithAmount.length === 0
          ? null
          : Math.round(
              investmentsWithAmount.reduce(
                (sum, i) => sum + (i.amount ?? 0),
                0
              ) / investmentsWithAmount.length
            );

      const mostRecent = investments[0];

      return {
        id: inv.id,
        name: inv.name,
        type: inv.type,
        avatarUrl: inv.avatarUrl,
        websiteUrl: inv.websiteUrl,
        totalInvestments,
        averageInvestmentSize,
        mostRecentInvestmentCompany:
          mostRecent?.company.name ?? null,
        mostRecentInvestmentDate:
          mostRecent?.investedAt ?? null,
        investments,
      };
    });
  },
  ["investor-summaries-v1"],
  {
    revalidate: 60 * 60, // 1 hour
    tags: ["investors"],
  }
);
