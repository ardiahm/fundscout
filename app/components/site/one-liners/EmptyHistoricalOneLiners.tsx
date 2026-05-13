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
import { useRouter } from "next/navigation";


export function EmptyHistoricalOneLiners() {
    const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookX />
        </EmptyMedia>
        <EmptyTitle>No Generated One Liners</EmptyTitle>
        <EmptyDescription>
          Fill out the generator form to get started!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" className="bg-bluee-600" onClick={() => router.push("/one-liner/generator")}>
          Generator Form
        </Button>
      </EmptyContent>
    </Empty>
  );
}
