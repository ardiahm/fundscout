import { ensureUser } from "@/app/lib/auth/ensureUser";
import PricingPageClient from "./PricingPageClient";
import { PLAN_FROM_DB } from "./plans";

export default async function PricingPage() {
  // verify user
  const user = await ensureUser();

  return (
    <PricingPageClient
      currentPlan={PLAN_FROM_DB[user.plan]}
      stage={user.stage ?? null}
    />
  );
}
