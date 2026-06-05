"use client";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/app/components/ui/empty";
import { Button } from "@/app/components/ui/button";
import { BookX } from "lucide-react";
import type { OneLinerInteraction } from "@/backend/types/oneliner";
import { EmptyHistoricalOneLiners } from "../components/site/one-liners/EmptyHistoricalOneLiners";
import { DisplayHistoricalOneLiners } from "../components/site/one-liners/DisplayHistoricalOneLiners";

type HistoryClientProps = {
  userId: string;
  userHistory: OneLinerInteraction[];
  deleteAction: (interactionId: string) => Promise<void>;
};

// history client checks if a user has any historical one liners
export function HistoryClient({
  userId,
  userHistory,
  deleteAction,
}: HistoryClientProps) {
  let count = userHistory?.length;

  let hasHistory = false;

  if (count > 0) {
    hasHistory = true;
  }

  return (
    // if they have history, display historical one liners, else display empty historical one liners component
    // empty component redircts to /one-liner/generator (form)
    <div>
      {hasHistory ? (
        <DisplayHistoricalOneLiners
          history={userHistory}
          deleteAction={deleteAction}
        />
      ) : (
        <EmptyHistoricalOneLiners />
      )}
    </div>
  );
}
