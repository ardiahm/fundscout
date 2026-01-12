"use client";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { InvestorRow } from "../../components/site/InvestorRow";
import { LoadingInvestorCard } from "../../components/site/loading/LoadingInvestorCard";
import type { InvestorComplete } from "@/backend/types/investor";
import {User} from "@/backend/lib/generated/prisma/client"



export default function LoadingDashboardClient() {
  return (
    <div className="w-full flex gap-4">
      {/* LEFT (main column) */}
      <div className="flex-1 pl-10 pb-10 pr-10 pt-2">
        {/* Search */}
        <div className="grid grid-cols-2 justify-end">
          <div className="font-semibold px-4  text-3xl">
          
            Investor Index
          </div>
          <div className="gap-3 flex w-full gap-2 md:justify-end px-4 md:px-10">
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
          <p className="text-left"></p>
        </div>

        {/* Investor Results */}
        <div className="py-4 space-y-2 px-4 md:px-10">
          <LoadingInvestorCard />
          <LoadingInvestorCard />
          <LoadingInvestorCard />
          <LoadingInvestorCard />
          <LoadingInvestorCard />
          <LoadingInvestorCard />
          <LoadingInvestorCard />
          <LoadingInvestorCard />
          <LoadingInvestorCard />
          
        </div>
      </div>

      {/* RIGHT (optional featured card / preview) */}
    </div>
  );
}
