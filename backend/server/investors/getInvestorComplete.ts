import dotenv from "dotenv"
import { prisma } from "../../lib/prisma"

dotenv.config({ path: "backend/.env" })
console.log("DATABASE_URL:", process.env.DATABASE_URL)

/**
 * Returns full investor objects with:
 * - details
 * - investments
 * - computed summary fields
 */
export async function getInvestorsComplete() {
  const investors = await prisma.investor.findMany({
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
      favoritedBy: true
    },
  })

  return investors.map((inv) => {
    const investments = inv.investments ?? []

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

    return {
      id: inv.id,
      name: inv.name,
      type: inv.type,
      avatarUrl: inv.avatarUrl,
      websiteUrl: inv.websiteUrl,

      // summary fields
      totalInvestments,
      averageInvestmentSize,
      mostRecentInvestmentCompany:
        mostRecentInvestment?.company?.name ?? null,
      mostRecentInvestmentDate:
        mostRecentInvestment?.investedAt ?? null,

      // full relational data
      investments,
      isFavorited: inv.favoritedBy.length > 0
    }
  })
}
