import {getInvestorsComplete} from "../../backend/server/investors/getInvestorComplete"
import {ensureUser} from "@/app/lib/auth/ensureUser"
import DashboardClient from "./DashboardClient"
import {auth} from "@clerk/nextjs/server"


export default async function DashboardPage() {
  const investors = await getInvestorsComplete();
  const user = await ensureUser();
  

  

  return <DashboardClient investors={investors} user={user}/>
}
