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
import { MailX } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmptyHistoricalOutreach() {
  const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MailX />
        </EmptyMedia>
        <EmptyTitle>No Generated Outreach</EmptyTitle>
        <EmptyDescription>
          Fill out the generator form to get started!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={() => router.push("/outreach/generator")}>
          Generator Form
        </Button>
      </EmptyContent>
    </Empty>
  );
}
