import { getInvestorsComplete } from "../../backend/server/investors/getInvestorComplete";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import DashboardClient from "./DashboardClient";
import LoadingDashboardClient from "./loading/LoadingDashboardClient";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default async function DashboardPage() {
  const user = await ensureUser();
  const {} = await auth();

  const userId = user.id;
  if (!userId) {
    redirect("/sign-in");
  }

  const investors = await getInvestorsComplete(userId);

  return (
    <>
      <Suspense fallback={<LoadingDashboardClient />}>
        <DashboardClient investors={investors} user={user} />
      </Suspense>
    </>
  );
}
