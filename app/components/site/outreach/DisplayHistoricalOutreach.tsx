import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { CardGeneratedOutreach } from "@/app/components/site/outreach/CardGeneratedOutreach";
import type { OutreachInteraction } from "@/backend/types/outreach";
import { Separator } from "@/app/components/ui/separator";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type DisplayHistoricalOutreachProps = {
  history: OutreachInteraction[];
  deleteAction: (interactionId: string) => Promise<void>;
};

export function DisplayHistoricalOutreach({
  history,
  deleteAction,
}: DisplayHistoricalOutreachProps) {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
            <div className="pt-2 pl-2">Generated Outreach: </div>
            <Button className="w-full sm:w-auto text-xl px-8 py-6 font-semibold bg-blue-600 hover:bg-blue-800" onClick={() => router.push("/outreach/generator")} >Generate More</Button>
          </CardTitle>
          <div className="py-2">
            <Separator />
          </div>
          <CardContent className="py-6 px-0 sm:px-6">
            {/* emails run long, so one per row until very wide screens */}
            <div className="grid grid-cols-1 gap-8 2xl:grid-cols-2">
              {history.map((interaction) => (
                <CardGeneratedOutreach
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
