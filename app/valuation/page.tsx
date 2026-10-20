import { ensureUser } from "@/app/lib/auth/ensureUser";
import { getUsersValuationHistory } from "@/backend/api/valuation/getUsersValuationHistory";
import { ValuationHistoryClient } from "@/app/valuation/ValuationHistoryClient";
import { deleteValuationInteraction } from "@/backend/server/valuation/deleteValuationInteraction";

export default async function ValuationPage() {
  // verify user
  const user = await ensureUser();

  const userId = user.id;
  if (!userId) {
    return 0;
  }

  const userHistory = await getUsersValuationHistory(userId);

  return (
    <div className="p-2 sm:p-5 lg:mx-30 md:mx-30 sm:mx-20">
      <ValuationHistoryClient userId={userId} userHistory={userHistory} deleteAction={deleteValuationInteraction} />
    </div>
  );
}
