import { getInvestorsComplete } from "../../backend/server/investors/getInvestorComplete";
import { getFavoriteInvestorsByUserID } from "../../backend/server/favorites/getFavoriteInvestorsByUserID";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import FavoritesClient from "./FavoritesClient";
import { auth } from "@clerk/nextjs/server";
import {redirect} from "next/navigation"

export default async function FavoritesPage() {
  const user = await ensureUser();
  const {} = await auth();

  const userId = user.id;
  if (!userId) {
    redirect("/sign-in")
  }

  const onlyFavorites = true;

  const favoriteInvestors = await getInvestorsComplete(userId, onlyFavorites);

  const favoriteInvestorsCount = favoriteInvestors.length;

  return <FavoritesClient favoriteInvestors={favoriteInvestors} favoriteInvestorsCount={favoriteInvestorsCount} />;
}
