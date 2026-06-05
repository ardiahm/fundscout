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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import type { OneLinerInteraction } from "@/backend/types/oneliner";
import { Separator } from "@/app/components/ui/separator";
import { useTransition } from "react";

// take a look at tabs and popover documentation, need to
// figure out what this page should look like.
// to have delete one liner functionality- must have a parent server component which contains this.

type OneLinerInteractionCardProps = {
  interaction: OneLinerInteraction;
  deleteAction: (interactionId: string) => Promise<void>;
};

export function CardGeneratedOneLiner({
  interaction, deleteAction
}: OneLinerInteractionCardProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex justify-between">
            <div>{interaction.submission?.name}</div>
            {/* need to change styling */}
            <div>
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
            {interaction.createdAt?.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-5">
          {interaction.response.generated_responses.map((oneLiner, index) => (
            <div
              key={oneLiner.id}
              className="grid grid-cols-[2rem_1fr] items-baseline gap-4 lg:min-h-[110px]"
            >
              <span className="leading-8 font-medium">{index + 1}:</span>

              <p className="m-0 leading-8">{oneLiner.response}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
