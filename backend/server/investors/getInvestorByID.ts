import dotenv from "dotenv"
import { prisma } from "../../lib/prisma"

dotenv.config({ path: "backend/.env" })

export async function getInvestorById(investorId: number) {
  return prisma.investor.findUnique({
    where: { id: investorId },
    include: {
      investments: {
        include: {
          company: {
            include: {
              sectors: {
                include: {
                    sector: true
                }
              }
            }
          }
        },
        orderBy: { investedAt: "desc" }
      }
    }
  })
}


export type InvestorWithDetails = Awaited<
  ReturnType<typeof getInvestorById>
>

export type InvestorWithDetailsNonNull =
  NonNullable<InvestorWithDetails>
