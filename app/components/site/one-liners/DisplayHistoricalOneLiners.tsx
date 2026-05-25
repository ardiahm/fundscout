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
import { CardGeneratedOneLiner } from "@/app/components/site/one-liners/CardGeneratedOneLiners";
import type { OneLinerInteraction } from "@/backend/types/oneliner";
import { Separator } from "@/app/components/ui/separator";
import {useRouter} from "next/navigation";

// take a look at tabs and popover documentation, need to
// figure out what this page should look like.
// to have delete one liner functionality- must have a parent server component which contains this.

type DisplayHistoricalOneLinersProps = {
  history: OneLinerInteraction[];
};

export function DisplayHistoricalOneLiners({
  history,
}: DisplayHistoricalOneLinersProps) {

  const router = useRouter();
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex justify-between pb-2">
            <div>Generated One-Liners: </div>
            <Button className="text-xl py-2 bg-blue-600 hover:bg-blue-800" onClick={() => router.push("/one-liner/generator")} >Generate More</Button>
          </CardTitle>
          <Separator />
          <CardContent className="py-6">
            <div className="grid grid-cols-2 gap-20">
              {history.map((interaction) => (
                <CardGeneratedOneLiner
                  key={interaction.id}
                  interaction={interaction}
                />
              ))}
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}
