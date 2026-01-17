import { getInvestorsCompleteWithSearch } from "../../backend/server/investors/getInvestorsCompleteWithSearch";
import { getFavoriteInvestorsByUserID } from "../../backend/server/favorites/getFavoriteInvestorsByUserID";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import FavoritesClient from "./FavoritesClient";
import { auth } from "@clerk/nextjs/server";
import {redirect} from "next/navigation"
import {getInvestorSummaries} from "@/backend/server/investors/getInvestorSummaries";
import {lightweightGetFavoriteInvestors} from "@/backend/server/favorites/lightweightGetFavoriteInvestors";


export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const user = await ensureUser();
  const {} = await auth();

  const userId = user.id;
  if (!userId) {
    redirect("/sign-in")
  }

 
   const investorSummary = await getInvestorSummaries();
 
   const favoriteInvestorsByID = await lightweightGetFavoriteInvestors(userId);
 

  return (
  <FavoritesClient
    investors={investorSummary}
    initialFavoriteInvestorIDs={[...favoriteInvestorsByID]}
  />
);}
