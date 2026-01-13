import { getInvestorsCompleteWithSearch } from "../../backend/server/investors/getInvestorsCompleteWithSearch";
import { getFavoriteInvestorsByUserID } from "../../backend/server/favorites/getFavoriteInvestorsByUserID";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import FavoritesClient from "./FavoritesClient";
import { auth } from "@clerk/nextjs/server";
import {redirect} from "next/navigation"

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

  const onlyFavorites = true;

   const search = await searchParams;
  const searchValue = search.search;

  const favoriteInvestors = await getInvestorsCompleteWithSearch(userId, onlyFavorites, searchValue);

  const favoriteInvestorsCount = favoriteInvestors.length;

  return <FavoritesClient favoriteInvestors={favoriteInvestors} favoriteInvestorsCount={favoriteInvestorsCount} />;
}
