"use client";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { SearchBar } from "../components/site/SearchBar";
import { InvestorCard } from "../components/site/InvestorCard";
import type { InvestorComplete } from "@/backend/types/investor";
import {User} from "@/backend/lib/generated/prisma/client"

type Props = {
  investors: InvestorComplete[];
  user: User;

};


export default function DashboardClient({ investors, user }: Props) {
  const correctURL = "dashboard";
  return (
    <div className="w-full flex gap-4">
      {/* LEFT (main column) */}
      <div className="flex-1 pl-10 pb-10 pr-10 pt-2">
        {/* Search */}
        <div className="flex flex-col md:grid md:grid-cols-2 md:justify-end lg:grid lg:grid-cols-2 lg:justify-end">
          <div className="font-semibold px-4  text-3xl">
          
            Investor Index
          </div>
          <div className="pt-2 md:pt-0 lg:pt-0">
            <SearchBar correctURL={correctURL} />
          </div>
        </div>

        {/* Investor Results */}
        <div className="@container py-4 space-y-2 px-4 md:px-10">
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
