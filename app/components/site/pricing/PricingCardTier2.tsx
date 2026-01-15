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

export function PricingCardTier2({ title }: Props) {
  return (
    <Card>
      <CardTitle className="text-center text-3xl">
        {title}
        <CardDescription className="py-3 mx-2">
          For founders in active fundraising mode
        </CardDescription>
      </CardTitle>

      <CardContent className="space-y-4">
        <CardDescription className="py-3 mx-2 text-black font-semibold">
          Everything in Founder, plus:
        </CardDescription>

        <ul className="space-y-2 mx-2 text-sm">
          <li>♾ Unlimited Scout AI chats</li>
          <li>♾ Unlimited Pitch Deck generations</li>
          <li>♾ Unlimited access to all tools &amp; generators</li>
          <li>⚡ Priority processing (faster AI responses)</li>
          <li>🧪 Early access to new FundScout features</li>
          <li>
            🧭 Advanced investor analytics{" "}
            <span className="text-muted-foreground">(coming soon)</span>
          </li>
        </ul>

        <CardDescription className="pt-4 mx-2 text-black font-semibold">
          Coming soon
        </CardDescription>

        <ul className="space-y-2 mx-2 text-sm text-muted-foreground">
          <li>• Smart intro targeting</li>
          <li>• Portfolio overlap mapping</li>
          <li>• Fundraising progress tracking</li>
          <li>• Auto-generated investor shortlists</li>
        </ul>
      </CardContent>
    </Card>
  );
}
