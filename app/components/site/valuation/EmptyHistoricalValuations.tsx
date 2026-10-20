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
import { Calculator } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmptyHistoricalValuations() {
  const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Calculator />
        </EmptyMedia>
        <EmptyTitle>No Valuations Yet</EmptyTitle>
        <EmptyDescription>
          Answer a few questions about your startup to get an estimated valuation range.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={() => router.push("/valuation/calculator")}>
          Valuation Calculator
        </Button>
      </EmptyContent>
    </Empty>
  );
}
