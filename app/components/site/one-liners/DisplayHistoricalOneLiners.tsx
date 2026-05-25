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
import { CardGeneratedOneLiner } from "@/app/components/site/one-liners/CardGeneratedOneLiners";
import type { OneLinerInteraction } from "@/backend/types/oneliner";

// take a look at tabs and popover documentation, need to
// figure out what this page should look like.
// to have delete one liner functionality- must have a parent server component which contains this.

type DisplayHistoricalOneLinersProps = {
  history: OneLinerInteraction[];
};

export function DisplayHistoricalOneLiners({
  history,
}: DisplayHistoricalOneLinersProps) {
  return (
    <div className="grid grid-cols-1">
      {history.map((interaction) => (
        <CardGeneratedOneLiner key={interaction.id} interaction={interaction} />
      ))}
    </div>
  );
}
