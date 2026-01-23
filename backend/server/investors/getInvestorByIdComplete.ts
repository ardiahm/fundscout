// backend/server/investors/getInvestorByIdComplete.ts

import { prisma } from "../../lib/prisma"

export async function getInvestorByIdComplete(id: number, userId?: string) {
  const investor = await prisma.investor.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      type: true,
      avatarUrl: true,
      websiteUrl: true,
      favoritedBy: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : false,
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
    },
  })

  if (!investor) return null

  const investments = investor.investments ?? []

  const totalInvestments = investments.length

  const investmentsWithAmount = investments.filter(
    (i) => i.amount !== null
  )

  const averageInvestmentSize =
    investmentsWithAmount.length === 0
      ? null
      : Math.round(
          investmentsWithAmount.reduce(
            (sum, i) => sum + (i.amount ?? 0),
            0
          ) / investmentsWithAmount.length
        )

  const mostRecentInvestment = investments[0] ?? null


  const isFavorited =
  userId && investor.favoritedBy
    ? investor.favoritedBy.length > 0
    : false


  return {
    ...investor,
    totalInvestments,
    isFavorited,
    averageInvestmentSize,
    mostRecentInvestmentCompany:
      mostRecentInvestment?.company?.name ?? null,
    mostRecentInvestmentDate:
      mostRecentInvestment?.investedAt ?? null,
  }
}
