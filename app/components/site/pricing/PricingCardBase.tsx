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

export function PricingCardBase({ title }: Props) {
  return (
    <Card>
  <CardTitle className="text-center text-3xl">
    {title}
    <CardDescription className="py-3 mx-2">
      Perfect for exploring ideas and validating direction
    </CardDescription>
  </CardTitle>

  <CardContent className="space-y-2">
    <CardDescription className=" mx-2 text-black font-semibold">
      What you get
    </CardDescription>

    <ul className="space-y-2 mx-2 text-sm">
      <li>✔ Unlimited Investor Finder</li>
      <li>✔ Unlimited Market Research</li>
      <li>✔ Unlimited Startup Valuation Tool</li>
    </ul>

    <CardDescription className="pt-4 mx-2 text-black font-semibold">
      Build &amp; test
    </CardDescription>

    <ul className="space-y-2 mx-2 text-sm text-muted-foreground">
      <li>🔒 3 Pitch Deck generations (lifetime)</li>
      <li>🔒 3 One-Liner generations (lifetime)</li>
      <li>🔒 3 Outreach Email generations (lifetime)</li>
    </ul>
  </CardContent>
</Card>

  );
}
