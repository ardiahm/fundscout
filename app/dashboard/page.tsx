import { getInvestorsCompleteWithSearch } from "../../backend/server/investors/getInvestorsCompleteWithSearch";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import DashboardClient from "./DashboardClient";
import LoadingDashboardClient from "./loading/LoadingDashboardClient";
import {getInvestorSummaries} from "@/backend/server/investors/getInvestorSummaries";
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

  // TODO: clean up code and remove any server side searching
  // const search = await searchParams;
  // const searchValue = search.search;

  const investors = await getInvestorsCompleteWithSearch(userId, false, undefined);

  const investorSummary = await getInvestorSummaries();

  const favoriteInvestorsByID = await lightweightGetFavoriteInvestors(userId);


  return (
    <>
      <Suspense fallback={<LoadingDashboardClient />}>
        <DashboardClient investors={investorSummary} initialFavoriteInvestorIDs={[...favoriteInvestorsByID]}/>
      </Suspense>
    </>
  );
}
