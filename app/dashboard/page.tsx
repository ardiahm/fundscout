import { getInvestorsCompleteWithSearch } from "../../backend/server/investors/getInvestorsCompleteWithSearch";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import DashboardClient from "./DashboardClient";
import LoadingDashboardClient from "./loading/LoadingDashboardClient";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const user = await ensureUser();
  const {} = await auth();

  const userId = user.id;
  if (!userId) {
    redirect("/sign-in");
  }

  const search = await searchParams;
  const searchValue = search.search;

  const investors = await getInvestorsCompleteWithSearch(userId, false, searchValue);

  return (
    <>
      <Suspense fallback={<LoadingDashboardClient />}>
        <DashboardClient investors={investors} user={user} />
      </Suspense>
    </>
  );
}
