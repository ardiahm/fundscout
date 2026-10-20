"use client";

import type { OutreachInteraction } from "@/backend/types/outreach";
import { EmptyHistoricalOutreach } from "../components/site/outreach/EmptyHistoricalOutreach";
import { DisplayHistoricalOutreach } from "../components/site/outreach/DisplayHistoricalOutreach";
import { useEffect } from "react"

type OutreachHistoryClientProps = {
  userId: string;
  userHistory: OutreachInteraction[];
  deleteAction: (interactionId: string) => Promise<void>;
};

// history client checks if a user has any historical outreach
export function OutreachHistoryClient({
  userId,
  userHistory,
  deleteAction,
}: OutreachHistoryClientProps) {
  const count = userHistory?.length;

  let hasHistory = false;

  if (count > 0) {
    hasHistory = true;
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    // if they have history, display historical outreach, else display empty historical outreach component
    // empty component redirects to /outreach/generator (form)
    <div>
      {hasHistory ? (
        <DisplayHistoricalOutreach
          history={userHistory}
          deleteAction={deleteAction}
        />
      ) : (
        <EmptyHistoricalOutreach />
      )}
    </div>
  );
}
