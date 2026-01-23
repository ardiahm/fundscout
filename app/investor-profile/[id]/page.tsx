import { notFound } from "next/navigation"
import InvestorClient from "./InvestorClient"
import {lightweightGetFavoriteInvestors} from "@/backend/server/favorites/lightweightGetFavoriteInvestors";
import { getInvestorByIdComplete } from "../../../backend/server/investors/getInvestorByIdComplete"
import { InvestorComplete } from "../../../backend/types/investor"
import { auth } from "@clerk/nextjs/server";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import { redirect } from "next/navigation";

interface PageProps {
  params: { id: string }
}

function assertExists<T>(value: T | null | undefined): asserts value is T {
  if (value == null) notFound()
}

export default async function InvestorPage({ params }: PageProps) {
  const user = await ensureUser();
    const {} = await auth();
  
    const userId = user.id;
    if (!userId) {
      redirect("/sign-in");
    }

  const {id} = await params
  const investorId = Number(id)
  if (Number.isNaN(investorId)) notFound()

  const investor: InvestorComplete | null =
    await getInvestorByIdComplete(investorId)

  assertExists(investor)

  const favoriteInvestorsByID = await lightweightGetFavoriteInvestors(userId);

  const initialIsFavorited = favoriteInvestorsByID.has(investorId);

  return <InvestorClient investor={investor}  initialFavoriteInvestorIDs={[...favoriteInvestorsByID]} />
}
