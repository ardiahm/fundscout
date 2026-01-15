import {
  Card,
  CardTitle,
  CardHeader,
  CardAction,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";

// pricing card needs

type Props = {
  title: string;
};

export function PricingCardTier1({ title }: Props) {
  return (
    <Card>
      <CardTitle className="text-center text-3xl">
        {title}
        <CardDescription className="py-3 mx-2">
          For founders actively preparing to raise
        </CardDescription>
      </CardTitle>

      <CardContent className="space-y-4">
        <CardDescription className="py-3 mx-2 text-black font-semibold">
          Everything in Scout, plus:
        </CardDescription>

        {/* Startup Workspace */}
        <CardDescription className="pt-2 mx-2 text-black font-semibold">
          🏗 Startup Workspace
        </CardDescription>
        <ul className="space-y-2 mx-2 text-sm">
          <li>✔ Add and manage your startup/company</li>
          <li>✔ Save decks, messaging, and investor insights in one place</li>
        </ul>

        {/* AI Assistant */}
        <CardDescription className="pt-4 mx-2 text-black font-semibold">
          🤖 AI Assistant — “Scout AI”
        </CardDescription>
        <ul className="space-y-2 mx-2 text-sm">
          <li>✔ 10 chats per day</li>
          <li className="pt-1 font-medium">✔ Ask questions about:</li>
          <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
            <li>Investors</li>
            <li>Pitch strategy</li>
            <li>Fundraising positioning</li>
            <li>Market comparisons</li>
          </ul>
        </ul>

        {/* AI Generators */}
        <CardDescription className="pt-4 mx-2 text-black font-semibold">
          🧠 AI Generators
        </CardDescription>
        <ul className="space-y-2 mx-2 text-sm">
          <li>✔ 5 Pitch Deck generations per day</li>
          <li>✔ Unlimited One-Liners</li>
          <li>✔ Unlimited Outreach Emails</li>
        </ul>

        {/* Investor Intelligence */}
        <CardDescription className="pt-4 mx-2 text-black font-semibold">
          📊 Investor Intelligence
        </CardDescription>
        <ul className="space-y-2 mx-2 text-sm">
          <li>
            ✔ Investor Relevancy Score
            <div className="text-xs text-muted-foreground">
              How well your startup matches each investor
            </div>
          </li>
          <li>
            ✔ Why This Investor? breakdown
            <div className="text-xs text-muted-foreground">
              Stage fit, sector fit, past investments
            </div>
          </li>
          <li>✔ Warm vs Cold Indicator</li>
          <li>✔ Suggested Talking Points per investor</li>
        </ul>
      </CardContent>
    </Card>
  );
}
