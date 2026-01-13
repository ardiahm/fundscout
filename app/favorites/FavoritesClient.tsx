"use client";

import type { InvestorComplete } from "@/backend/types/investor";
import {User} from "@/backend/lib/generated/prisma/client"
import { InvestorCard } from "@/app/components/site/InvestorCard"
import { SearchBar } from "@/app/components/site/SearchBar"

import {Button} from "@/app/components/ui/button"
import {Input} from "@/app/components/ui/input"


type Props = {
    favoriteInvestors: InvestorComplete[],
    favoriteInvestorsCount: number,
}

export default function FavoritesClient({favoriteInvestors, favoriteInvestorsCount}: Props) {

  const correctURL = "favorites";
return (
    <>
    <div className="w-full flex gap-4">
      {/* LEFT (main column) */}
      <div className="flex-1 pl-10 pb-10 pr-10 pt-2">
        {/* Search */}
        <div className="grid grid-cols-2 justify-end">
          <div className="font-semibold px-4  text-3xl">
          
            Favorite Investors{" ("}{favoriteInvestorsCount}{") "}
          </div>
          <SearchBar correctURL={correctURL} />
          <p className="text-left"></p>
        </div>

        {/* Investor Results */}
        <div className="py-4 space-y-2 px-4 md:px-10">
          {favoriteInvestors.map((investor, idx) => (
            <div
              key={investor.id}
              className={idx % 2 === 0 ? "rounded-sm" : ""}
            >
              {/* Pass ONLY what InvestorRow needs */}
              <InvestorCard investor={investor} />
            </div>
          ))}
          {favoriteInvestors.length > 0 && <div className="w-[350px] p-4"></div>}
        </div>
      </div>

      {/* RIGHT (optional featured card / preview) */}
    </div>
    </>
)
}