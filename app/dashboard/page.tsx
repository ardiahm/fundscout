import { getInvestorsCompleteWithSearch } from "../../backend/server/investors/getInvestorsCompleteWithSearch";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import DashboardClient from "./DashboardClient";
import LoadingDashboardClient from "./loading/LoadingDashboardClient";
import {getInvestorSummaries} from "@/backend/server/investors/getInvestorSummaries";
import {getInvestorSummariesCached} from "@/backend/server/investors/getInvestorSummariesCached";

import {lightweightGetFavoriteInvestors} from "@/backend/server/favorites/lightweightGetFavoriteInvestors";
import {toggleFavoriteInvestor} from "@/app/lib/favorites/toggleFavoriteInvestor";
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


  const cachedInvestorSummary = await getInvestorSummariesCached();

  const favoriteInvestorsByID = await lightweightGetFavoriteInvestors(userId);

  const investorsWithFavorites = cachedInvestorSummary.map((inv) => ({
    ...inv,
    isFavorited: favoriteInvestorsByID.has(inv.id),
  }));


  return (
    <>
      <Suspense fallback={<LoadingDashboardClient />}>
        <DashboardClient investors={investorsWithFavorites} initialFavoriteInvestorIDs={[...favoriteInvestorsByID]}/>
      </Suspense>
    </>
  );
}
