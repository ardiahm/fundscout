import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
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
import { X } from "lucide-react";

// take a look at tabs and popover documentation, need to
// figure out what this page should look like.
// to have delete one liner functionality- must have a parent server component which contains this.

type OneLinerInteractionCardProps = {
  interaction: OneLinerInteraction;
};

export function CardGeneratedOneLiner({
  interaction,
}: OneLinerInteractionCardProps) {
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
                <PopoverContent align="start">
                  <PopoverHeader>
                    <PopoverTitle>Are you sure?</PopoverTitle>
                    <PopoverDescription className="flex justify-center pt-2">
                      <Button className="bg-blue-600 hover:bg-blue-700">I want to delete</Button>
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
        <CardContent className="space-y-3">
          {interaction.response.generated_responses.map((oneLiner, index) => (
            <p key={oneLiner.id}>
              {index + 1}: {oneLiner.response}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
