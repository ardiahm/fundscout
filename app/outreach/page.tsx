import OneLinerClient from "./generator/generator-client";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import { prisma } from "@/backend/lib/prisma";
import { getUsersOneLinerHistory } from "@/backend/api/oneliner/getUsersOneLinerHistory";
import { EmptyHistoricalOneLiners } from "@/app/components/site/one-liners/EmptyHistoricalOneLiners";
import { HistoryClient } from "@/app/one-liner/HistoryClient";
import { deleteOneLinerInteraction } from "@/backend/server/one-liners/deleteOneLinerInteraction";

export default async function OutreachPage() {
  // verify user
  const user = await ensureUser();

  const userId = user.id;
  if (!userId) {
    return 0;
  }

  let userHistory = await getUsersOneLinerHistory(userId);

  

  return (
    <div className="p-5 lg:mx-30 md:mx-30 sm:mx-20">
      <HistoryClient userId={userId} userHistory={userHistory} deleteAction={deleteOneLinerInteraction} />
    </div>
  );
}
