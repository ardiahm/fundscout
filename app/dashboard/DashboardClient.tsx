"use client";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { InvestorRow } from "../components/site/InvestorRow";
import { InvestorCard } from "../components/site/InvestorCard";
import type { InvestorComplete } from "@/backend/types/investor";

type Props = {
  investors: InvestorComplete[];
};

export default function DashboardClient({ investors }: Props) {
  return (
    <div className="w-full h-screen flex gap-4">
      {/* LEFT (main column) */}
      <div className="flex-1 p-4">
        {/* Search */}
        <div className="grid grid-cols-2 items-center gap-2">
          <p className="text-left"></p>

          <div className="flex gap-2 justify-end">
            <Input
              type="search"
              placeholder="Search for VCs, Angels, and other funds"
            />
            <Button
              type="submit"
              variant="outline"
              className="transition delay-20 hover:border-black"
            >
              Enter
            </Button>
          </div>
        </div>

        {/* Investor Results */}
        <div className="py-4 space-y-2">
          {investors.map((investor, idx) => (
            <div
              key={investor.id}
              className={idx % 2 === 0 ? "rounded-sm" : ""}
            >
              {/* Pass ONLY what InvestorRow needs */}
              <InvestorCard investor={investor} />
            </div>
          ))}
          {investors.length > 0 && <div className="w-[350px] p-4"></div>}
        </div>
      </div>

      {/* RIGHT (optional featured card / preview) */}
    </div>
  );
}
