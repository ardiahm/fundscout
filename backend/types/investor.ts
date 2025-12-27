export type InvestorSummary = {
  id: number
  name: string
  type: string
  avatarUrl?: string | null
  websiteUrl?: string | null

  totalInvestments: number
  averageInvestmentSize: number | null

  mostRecentInvestmentCompany: string | null
  mostRecentInvestmentDate: Date | null
}
