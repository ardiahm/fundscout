"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import type { InvestorComplete } from "../../../../backend/types/investor";

interface MostRecentInvestmentCardProps {
  investor: InvestorComplete;
  showBackButton?: boolean;
}

export default function MostRecentInvestmentCard({
  investor,
}: MostRecentInvestmentCardProps) {
  const mostRecentInvestment =
  investor.investments
    .filter(inv => inv.investedAt !== null)
    .sort(
      (a, b) =>
        new Date(b.investedAt!).getTime() -
        new Date(a.investedAt!).getTime()
    )[0] ?? null;

      //TODO: OVERLAY IF NOT PREMIUM USER
  return (
    <div>
      <Card className="bg-sky-50 border-sky-200">
        <CardHeader className="space-y-2">
          {/* Header and Logo */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-semibold text-sky-600 font-style: underline">
                Most Recent:
              </p>

              <div className="pr-6">
                  {mostRecentInvestment?.company.logoUrl && (
                    <img
                      src={mostRecentInvestment.company.logoUrl}
                      alt={mostRecentInvestment.company.name}
                      className="h-15 w-auto object-contain rounded-md"
                    />
                  )}
              </div>
            </div>
            {/* Largest Investment Data */}
            <div className="grid grid-cols-2 pt-6">
              <div>
                <p className="text-xl font-semibold text-sky-600 pt-4">
                  Company:
                </p>
                <p className="text-l font-bold text-black">
                  - {mostRecentInvestment?.company.name}
                </p>
              </div>
              <div>
                <p className="text-xl font-semibold text-sky-600 pt-4">
                  Investment Size:
                </p>
                <p className="text-l font-semibold text-black">-{" "}${mostRecentInvestment?.amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-sky-600 pt-4">
                  Date:
                </p>
                <p className="text-l font-semibold text-black">-{" "}{mostRecentInvestment?.investedAt? new Date(mostRecentInvestment.investedAt).toLocaleDateString()
                    : "—"}</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-sky-600 pt-4">
                  Stage:
                </p>
                <p className="text-l font-semibold text-black">-{" "}{mostRecentInvestment?.stage}</p>
              </div>
            </div> {/* Close Data Container */}

          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
