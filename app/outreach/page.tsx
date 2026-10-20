import { ensureUser } from "@/app/lib/auth/ensureUser";
import { getUsersOutreachHistory } from "@/backend/api/outreach/getUsersOutreachHistory";
import { OutreachHistoryClient } from "@/app/outreach/OutreachHistoryClient";
import { deleteOutreachInteraction } from "@/backend/server/outreach/deleteOutreachInteraction";

export default async function OutreachPage() {
  // verify user
  const user = await ensureUser();

  const userId = user.id;
  if (!userId) {
    return 0;
  }

  const userHistory = await getUsersOutreachHistory(userId);

  return (
    <div className="p-2 sm:p-5 lg:mx-30 md:mx-30 sm:mx-20">
      <OutreachHistoryClient userId={userId} userHistory={userHistory} deleteAction={deleteOutreachInteraction} />
    </div>
  );
}
