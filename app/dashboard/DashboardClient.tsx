"use client";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { InvestorRow } from "../components/site/InvestorRow";
import { InvestorSummary } from "@/backend/types/investor";

type Props = {
  investors: InvestorSummary[];
};

export default function DashboardClient({ investors }: Props) {
  return (
    <>
      <div className="w-full h-screen flex gap-4">
        {/* LEFT (2/3) */}
        <div className="w-max p-4">
          
          {/* Search */}
          <div className="grid grid-cols-2 items-center gap-2">
            <p className="text-left">Investor Index</p>
            <div className="flex max-w items-right gap-2">
              <Input
                type="search"
                placeholder="Search for VCs, Angels, and other funds"
              />
              <Button type="submit" variant="outline">
                Enter
              </Button>
            </div>
            
          </div>

          {/* Investor Results */}
          <div className="py-4 space-y-1">
            {investors.map((investor, idx) => (
              <div
                key={investor.id}
                className={idx % 2 === 0 ? "bg-blue-100" : ""}
              >
                <InvestorRow investor={investor} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
