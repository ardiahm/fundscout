"use client";

import { Button } from "@/app/components/ui/button";
import {
  Popover,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import type { OutreachInteraction } from "@/backend/types/outreach";
import {
  outreachAskLabels,
  outreachMethodLabels,
} from "@/backend/constants/outreach";
import { Separator } from "@/app/components/ui/separator";
import { useTransition } from "react";
import { CopyButton } from "../../ui/CopyButton";

type OutreachInteractionCardProps = {
  interaction: OutreachInteraction;
  deleteAction: (interactionId: string) => Promise<void>;
};

export function CardGeneratedOutreach({
  interaction,
  deleteAction,
}: OutreachInteractionCardProps) {
  const [isPending, startTransition] = useTransition();

  const submission = interaction.submission;
  const recipient = submission?.recipient || "Unnamed recipient";
  const { subject, response } = interaction.response;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl flex min-w-0 justify-between gap-2">
            {/* recipient is free text, so keep it to one line */}
            <div className="min-w-0 truncate" title={recipient}>
              <span className="font-light">To: </span>
              <span className="font-medium">{recipient}</span>
            </div>
            <div className="shrink-0">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">X</Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="max-w-40">
                  <PopoverHeader>
                    <PopoverTitle>Are you sure?</PopoverTitle>
                    <PopoverDescription className="flex pt-2">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        variant="destructive"
                        onClick={() => {
                          startTransition(async () => {
                            await deleteAction(interaction.id);
                          });
                        }}
                      >
                        {isPending ? "Deleting..." : "I want to delete"}
                      </Button>
                    </PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            </div>
          </CardTitle>
          <CardDescription>
            <span className="font-light">Date: </span>
            <span className="font-medium">
              {interaction.createdAt?.toLocaleDateString()}
            </span>
            {submission && (
              <>
                <span className="font-light"> · </span>
                <span className="font-medium">
                  {outreachMethodLabels[submission.method]}
                </span>
                <span className="font-light"> · </span>
                <span className="font-medium">
                  {outreachAskLabels[submission.ask]}
                </span>
              </>
            )}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6">
          {subject && (
            <div className="relative grid gap-2 sm:pr-28">
              <span className="text-sm font-light">Subject</span>
              <p className="m-0 font-medium leading-7">{subject}</p>
              <div className="sm:absolute sm:top-0 sm:right-0">
                <CopyButton text={subject} />
              </div>
            </div>
          )}

          <div className="relative grid gap-2 sm:pr-28">
            <span className="text-sm font-light">
              {subject ? "Body" : "Message"}
            </span>
            <p className="m-0 leading-7 whitespace-pre-wrap">{response}</p>
            <div className="sm:absolute sm:top-0 sm:right-0">
              <CopyButton text={response} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
