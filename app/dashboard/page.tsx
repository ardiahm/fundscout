import {getInvestorsComplete} from "../../backend/server/investors/getInvestorComplete"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const investors = await getInvestorsComplete()

  return <DashboardClient investors={investors} />
}
