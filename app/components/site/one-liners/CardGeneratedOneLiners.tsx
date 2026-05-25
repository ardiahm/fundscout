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
          <CardTitle className="text-3xl">
            {interaction.submission?.name}
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
