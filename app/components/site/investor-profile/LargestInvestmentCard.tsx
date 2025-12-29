"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import type { InvestorComplete } from "../../../../backend/types/investor";

interface LargestInvestmentCardProps {
  investor: InvestorComplete;
  showBackButton?: boolean;
}

export default function LargestInvestmentCard({
  investor,
}: LargestInvestmentCardProps) {
  const largestInvestment =
    investor.investments
      .filter((inv) => inv.amount !== null)
      .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))[0] ?? null;


      //TODO: OVERLAY IF NOT PREMIUM USER
  return (
    <div>
      <Card className="bg-emerald-50 border-emerald-200">
        <CardHeader className="space-y-2">
          {/* Header and Logo */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-semibold text-emerald-700 font-style: underline">
                Largest Investment:
              </p>

              <div className="pr-6">
                  {largestInvestment?.company.logoUrl && (
                    <img
                      src={largestInvestment.company.logoUrl}
                      alt={largestInvestment.company.name}
                      className="h-15 w-auto object-contain rounded-md"
                    />
                  )}
              </div>
            </div>
            {/* Largest Investment Data */}
            <div className="grid grid-cols-2 pt-6">
              <div>
                <p className="text-xl font-semibold text-emerald-600 pt-4">
                  Company:
                </p>
                <p className="text-l font-bold text-black">
                  - {largestInvestment?.company.name}
                </p>
              </div>
              <div>
                <p className="text-xl font-semibold text-emerald-600 pt-4">
                  Investment Size:
                </p>
                <p className="text-l font-semibold text-black">-{" "}${largestInvestment?.amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-emerald-600 pt-4">
                  Date:
                </p>
                <p className="text-l font-semibold text-black">-{" "}{largestInvestment?.investedAt? new Date(largestInvestment.investedAt).toLocaleDateString()
                    : "—"}</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-emerald-600 pt-4">
                  Stage:
                </p>
                <p className="text-l font-semibold text-black">-{" "}{largestInvestment?.stage}</p>
              </div>
            </div> {/* Close Data Container */}

          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
