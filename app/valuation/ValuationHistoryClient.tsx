"use client";

import type { ValuationInteraction } from "@/backend/types/valuation";
import { EmptyHistoricalValuations } from "../components/site/valuation/EmptyHistoricalValuations";
import { DisplayHistoricalValuations } from "../components/site/valuation/DisplayHistoricalValuations";
import { useEffect } from "react"

type ValuationHistoryClientProps = {
  userId: string;
  userHistory: ValuationInteraction[];
  deleteAction: (interactionId: string) => Promise<void>;
};

// history client checks if a user has any past valuations
export function ValuationHistoryClient({
  userId,
  userHistory,
  deleteAction,
}: ValuationHistoryClientProps) {
  const count = userHistory?.length;

  let hasHistory = false;

  if (count > 0) {
    hasHistory = true;
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    // if they have history, display past valuations, else display empty past valuations component
    // empty component redirects to /valuation/calculator (form)
    <div>
      {hasHistory ? (
        <DisplayHistoricalValuations
          history={userHistory}
          deleteAction={deleteAction}
        />
      ) : (
        <EmptyHistoricalValuations />
      )}
    </div>
  );
}
