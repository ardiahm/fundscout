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
import { CopyButton } from "../../ui/CopyButton";

// take a look at tabs and popover documentation, need to
// figure out what this page should look like.
// to have delete one liner functionality- must have a parent server component which contains this.

type OneLinerInteractionCardProps = {
  interaction: OneLinerInteraction;
  deleteAction: (interactionId: string) => Promise<void>;
};

export function CardGeneratedOneLiner({
  interaction,
  deleteAction,
}: OneLinerInteractionCardProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex justify-between">
            <div>
              <span className="font-light">Name: </span>
              <span className="font-medium">
                {interaction.submission?.name}
              </span>
            </div>
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
            <span className="font-light">Date: </span>
            <span className="font-medium">
              {interaction.createdAt?.toLocaleDateString()}
            </span>
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <div>
            {interaction.response.generated_responses.map((oneLiner, index) => (
              <div
                key={oneLiner.id}
                className="relative grid grid-cols-[2rem_1fr] gap-4 pb-6 lg:min-h-[130px]"
              >
                <span className="leading-8 font-medium">{index + 1}:</span>

                <div className="pr-28">
                  <p className="m-0 leading-8">{oneLiner.response}</p>
                </div>

                <div className="absolute top-0 right-0">
                  <CopyButton text={`${oneLiner.response}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
