import {getInvestorsComplete} from "../../backend/server/investors/getInvestorComplete"
import {ensureUser} from "@/app/lib/auth/ensureUser"
import DashboardClient from "./DashboardClient"
import {redirect} from "next/navigation"
import {auth} from "@clerk/nextjs/server"


export default async function DashboardPage() {
  const investors = await getInvestorsComplete();
  const user = await ensureUser();

  if (!user) redirect("/sign-in");

  return <DashboardClient investors={investors} user={user}/>
}
