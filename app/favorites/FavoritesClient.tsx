"use client";

import type { InvestorSummary } from "@/backend/types/investor";
import { useMemo, useState } from "react";
import { InvestorCard } from "@/app/components/site/InvestorCard";
import { SearchBar } from "@/app/components/site/SearchBar";
import { toggleFavoriteInvestor } from "@/app/lib/favorites/toggleFavoriteInvestor";

type Props = {
  investors: InvestorSummary[];
  initialFavoriteInvestorIDs: number[];
};

export default function FavoritesClient({
  investors,
  initialFavoriteInvestorIDs,
}: Props) {
  const correctURL = "favorites";

  // ⭐ source of truth
  const [favoriteIds, setFavoriteIds] = useState<number[]>(
    initialFavoriteInvestorIDs
  );

  // fast lookup
  const favoriteSet = useMemo(
    () => new Set(favoriteIds),
    [favoriteIds]
  );

  // derive visible favorites
  const visibleInvestors = useMemo(() => {
    return investors.filter(inv => favoriteSet.has(inv.id));
  }, [investors, favoriteSet]);

  // optimistic toggle
  const toggleFavorite = async (investorId: number) => {
    setFavoriteIds(prev =>
      prev.includes(investorId)
        ? prev.filter(id => id !== investorId)
        : [...prev, investorId]
    );

    try {
      await toggleFavoriteInvestor(investorId);
    } catch {
      // rollback on failure
      setFavoriteIds(prev =>
        prev.includes(investorId)
          ? prev.filter(id => id !== investorId)
          : [...prev, investorId]
      );
    }
  };

  return (
    <div className="w-full flex gap-4">
      {/* LEFT */}
      <div className="flex-1 pl-10 pb-10 pr-10 pt-2">
        {/* Header */}
        <div className="flex flex-col md:grid md:grid-cols-2 md:justify-end lg:grid lg:grid-cols-2 lg:justify-end">
          <div className="font-semibold px-4 text-3xl">
            Favorite Investors ({visibleInvestors.length})
          </div>

          <div className="pt-2 md:pt-0 lg:pt-0">
            <SearchBar correctURL={correctURL} />
          </div>
        </div>

        {/* Results */}
        <div className="py-4 space-y-2 px-4 md:px-10">
          {visibleInvestors.map((investor, idx) => (
            <div
              key={investor.id}
              className={idx % 2 === 0 ? "rounded-sm" : ""}
            >
              <InvestorCard
                investor={investor}
                isFavorited={true}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ))}

          {visibleInvestors.length === 0 && (
            <div className="text-gray-500 text-sm px-4 py-10">
              You haven’t favorited any investors yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
