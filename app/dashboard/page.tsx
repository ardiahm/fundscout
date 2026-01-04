import {getInvestorsComplete} from "../../backend/server/investors/getInvestorComplete"
import DashboardClient from "./DashboardClient"
import { useRouter } from "next/navigation";


export default async function DashboardPage() {
  const investors = await getInvestorsComplete()

  const router = useRouter();

  

  return <DashboardClient investors={investors} />
}
