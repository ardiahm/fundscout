import { getInvestorSummaries } from "../../backend/server/investors/getInvestorSummaries"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const investors = await getInvestorSummaries()

  return <DashboardClient investors={investors} />
}
