import { Button } from "@/app/components/ui/button";
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
import { useEffect } from "react"

// take a look at tabs and popover documentation, need to
// figure out what this page should look like.
// to have delete one liner functionality- must have a parent server component which contains this.

type DisplayHistoricalOneLinersProps = {
  history: OneLinerInteraction[];
  deleteAction: (interactionId: string) => Promise<void>;
};

export function DisplayHistoricalOneLiners({
  history, deleteAction
}: DisplayHistoricalOneLinersProps) {

  const router = useRouter();

    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);

  
  return (
    <>
      <Card className="min-w-200">
        <CardHeader>
          <CardTitle className="text-3xl flex justify-between pb-2">
            <div className="pt-2 pl-2">Generated One-Liners: </div>
            <Button className="text-xl px-8 py-6 font-semibold bg-blue-600 hover:bg-blue-800" onClick={() => router.push("/one-liner/generator")} >Generate More</Button>
          </CardTitle>
          <div className="py-2">
            <Separator />
          </div>
          <CardContent className="py-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 ">
              {history.map((interaction) => (
                <CardGeneratedOneLiner
                  key={interaction.id}
                  interaction={interaction}
                  deleteAction={deleteAction}
                />
              ))}
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}
