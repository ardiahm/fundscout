"use client";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { useRouter } from "next/navigation";
import type { InvestorComplete } from "../../../../backend/types/investor";

interface InvestorProfileCardProps {
  investor: InvestorComplete;
  showBackButton?: boolean;
}

export default function InvestorProfileCard({
  investor,
}: InvestorProfileCardProps) {

  const website =
    investor.websiteUrl?.startsWith("http")
      ? investor.websiteUrl
      : investor.websiteUrl
      ? `https://${investor.websiteUrl}`
      : null;

  const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <Card>
      <CardHeader className="space-y-4">
    

        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {investor.avatarUrl && (
              <img
                src={investor.avatarUrl}
                alt={investor.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            )}

            <div>
              <CardTitle className="text-4xl">
                {investor.name}
              </CardTitle>
              <CardDescription className="italic pt-2">
                {investor.type}
              </CardDescription>
            </div>
          </div>

          {website && (
            <CardAction>
              <Button variant="ghost" asChild>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit website
                </a>
              </Button>
            </CardAction>
          )}
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 text-sm">
  {/* LEFT COLUMN */}
  <div className="space-y-3">
    <p>
      Tracked Investments:{" "}
      <span className="font-semibold">
        {investor.investments.length}
      </span>
    </p>

    <p>
      Most Recent Investment:{" "}
      <span className="font-semibold">
        {investor.mostRecentInvestmentCompany ?? "—"}
      </span>
    </p>
  </div>

  {/* RIGHT COLUMN */}
  <div className="space-y-3 text-right">
    <p>
      Average Investment Size:{" "}
      <span className="font-semibold">
        {investor.averageInvestmentSize !== null
          ? usdFormatter.format(investor.averageInvestmentSize)
          : "—"}
      </span>
    </p>

    <p>
      Most Recent Investment Date:{" "}
      <span className="font-semibold">
        {investor.mostRecentInvestmentDate
          ? new Date(
              investor.mostRecentInvestmentDate
            ).toLocaleDateString()
          : "—"}
      </span>
    </p>
  </div>
</CardContent>

    </Card>
  );
}
