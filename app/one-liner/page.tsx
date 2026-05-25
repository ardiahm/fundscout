import OneLinerClient from "./generator/one-liner-client";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import { prisma } from "@/backend/lib/prisma";
import { getUsersOneLinerHistory } from "@/backend/oneliner/api/getUsersOneLinerHistory";
import { EmptyHistoricalOneLiners } from "@/app/components/site/one-liners/EmptyHistoricalOneLiners";
import { HistoryClient } from "@/app/one-liner/HistoryClient";

export default async function OneLinerPage() {
  // verify user
  const user = await ensureUser();

  const userId = user.id;
  if (!userId) {
    return 0;
  }

  let userHistory = await getUsersOneLinerHistory(userId);

  return (
    <div className="p-5 lg:mx-30 md:mx-30 sm:mx-20">
      <HistoryClient userId={userId} userHistory={userHistory} />
    </div>
  );
}
