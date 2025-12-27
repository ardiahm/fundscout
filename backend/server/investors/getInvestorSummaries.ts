import dotenv from "dotenv"
import { prisma } from "../../lib/prisma"


dotenv.config({ path: "backend/.env" })
console.log("DATABASE_URL:", process.env.DATABASE_URL)



export async function getInvestorSummaries() {
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
            select: { name: true }
          }
        },
        orderBy: { investedAt: "desc" }
      }
    }
  })

  return investors.map(inv => {
    const investments = inv.investments

    const type = inv.type

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
    const mostRecent = investments[0]

    return {
      id: inv.id,
      name: inv.name,
      type: inv.type,
      avatarUrl: inv.avatarUrl,
      websiteUrl: inv.websiteUrl,
      totalInvestments,
      averageInvestmentSize,
      mostRecentInvestmentCompany: mostRecent?.company.name ?? null,
      mostRecentInvestmentDate: mostRecent?.investedAt ?? null,
    }
  })
}
