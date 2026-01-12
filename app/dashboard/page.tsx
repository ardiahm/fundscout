import {getInvestorsComplete} from "../../backend/server/investors/getInvestorComplete"
import {ensureUser} from "@/app/lib/auth/ensureUser"
import DashboardClient from "./DashboardClient"
import {redirect} from "next/navigation"
import {auth} from "@clerk/nextjs/server"


export default async function DashboardPage() {
  const user = await ensureUser();
  const {} = await auth();

  const userId = user.id;
  if (!userId) {
    redirect("/sign-in")
  }

    const investors = await getInvestorsComplete(userId);



  return <DashboardClient investors={investors} user={user}/>
}
