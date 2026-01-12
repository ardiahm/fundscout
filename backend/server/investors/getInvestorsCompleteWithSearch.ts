import dotenv from "dotenv";
import { prisma } from "../../lib/prisma";

dotenv.config({ path: "backend/.env" });
console.log("DATABASE_URL:", process.env.DATABASE_URL);

/**
 * Returns full investor objects with:
 * - details
 * - investments
 * - computed summary fields
 */
export async function getInvestorsCompleteWithSearch(
  userId?: string,
  onlyFavorites: boolean = false,
  searchQuery?: string
) {
  let investorsResult;

  const ftsQuery = searchQuery?.trim().split(/\s+/).join(" & ");

  if (onlyFavorites && userId && searchQuery) {
    investorsResult = await prisma.investor.findMany({
      where: {
        favoritedBy: {
          some: { userId },
        },
        ...(ftsQuery && {
          name: {
            contains: ftsQuery,
          },
        }),
      },
      select: {
        id: true,
        name: true,
        type: true,
        avatarUrl: true,
        websiteUrl: true,
        investments: {
          select: {
            id: true,
            amount: true,
            stage: true,
            investedAt: true,
            company: {
              select: {
                id: true,
                name: true,
                websiteUrl: true,
                description: true,
                logoUrl: true,
                location: true,
                sectors: {
                  select: {
                    id: true,
                    sectorId: true,
                    companyId: true,
                    sector: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { investedAt: "desc" },
        },
        favoritedBy: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : false,
      },
    });
  } else if (onlyFavorites && userId) {
    investorsResult = await prisma.investor.findMany({
      where: {
        favoritedBy: {
          some: { userId },
        },
        ...(ftsQuery && {
          name: {
            contains: ftsQuery,
          },
        }),
      },
      select: {
        id: true,
        name: true,
        type: true,
        avatarUrl: true,
        websiteUrl: true,
        investments: {
          select: {
            id: true,
            amount: true,
            stage: true,
            investedAt: true,
            company: {
              select: {
                id: true,
                name: true,
                websiteUrl: true,
                description: true,
                logoUrl: true,
                location: true,
                sectors: {
                  select: {
                    id: true,
                    sectorId: true,
                    companyId: true,
                    sector: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { investedAt: "desc" },
        },
        favoritedBy: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : false,
      },
    });
  } else if (userId && searchQuery) {
    investorsResult = await prisma.investor.findMany({
      where: {
        name: {
          search: ftsQuery,
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        avatarUrl: true,
        websiteUrl: true,
        investments: {
          select: {
            id: true,
            amount: true,
            stage: true,
            investedAt: true,
            company: {
              select: {
                id: true,
                name: true,
                websiteUrl: true,
                description: true,
                logoUrl: true,
                location: true,
                sectors: {
                  select: {
                    id: true,
                    sectorId: true,
                    companyId: true,
                    sector: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { investedAt: "desc" },
        },
        favoritedBy: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : false,
      },
    });
  } else {
    investorsResult = await prisma.investor.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        avatarUrl: true,
        websiteUrl: true,
        investments: {
          select: {
            id: true,
            amount: true,
            stage: true,
            investedAt: true,
            company: {
              select: {
                id: true,
                name: true,
                websiteUrl: true,
                description: true,
                logoUrl: true,
                location: true,
                sectors: {
                  select: {
                    id: true,
                    sectorId: true,
                    companyId: true,
                    sector: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { investedAt: "desc" },
        },
        favoritedBy: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : false,
      },
    });
  }

  return investorsResult.map((inv) => {
    const investments = inv.investments ?? [];

    const totalInvestments = investments.length;

    const investmentsWithAmount = investments.filter((i) => i.amount !== null);

    const averageInvestmentSize =
      investmentsWithAmount.length === 0
        ? null
        : Math.round(
            investmentsWithAmount.reduce((sum, i) => sum + (i.amount ?? 0), 0) /
              investmentsWithAmount.length
          );

    const mostRecentInvestment = investments[0] ?? null;

    return {
      id: inv.id,
      name: inv.name,
      type: inv.type,
      avatarUrl: inv.avatarUrl,
      websiteUrl: inv.websiteUrl,

      totalInvestments,
      averageInvestmentSize,
      mostRecentInvestmentCompany: mostRecentInvestment?.company?.name ?? null,
      mostRecentInvestmentDate: mostRecentInvestment?.investedAt ?? null,

      investments,
      isFavorited: userId ? inv.favoritedBy.length > 0 : false,
    };
  });
}
