import { InvestorSummary } from "../../../backend/types/investor";
import Link from "next/link";
import {
  Card,
  CardTitle,
  CardHeader,
  CardAction,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export type InvestorCardProps = {
  investor: InvestorSummary;
  isFavorited: boolean;
  onToggleFavorite: (investorId: number) => void;
};

export function InvestorCard({
  investor,
  isFavorited,
  onToggleFavorite,
}: InvestorCardProps) {
  return (
    <>
      <Card className="relative bg-sky-100/20 transition hover:bg-sky-100/80">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col gap-4 mx-auto">
              {/* ---------- TOP ROW ---------- */}
              <div className="flex items-start justify-between gap-4">
                {/* Left: Avatar + Name + Type */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {investor.avatarUrl ? (
                    <img
                      src={investor.avatarUrl}
                      alt={investor.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                      {investor.name}
                    </div>
                  )}

                  {/* Name + Type */}
                  <div className="flex flex-col">
                    <Link href={`/investor-profile/${investor.id}`}>
                      <span className="text-xl font-medium text-gray-900 hover:underline cursor-pointer">
                        {investor.name}
                      </span>
                    </Link>
                    <span className="text-xs text-gray-600">
                      {investor.type}
                    </span>
                  </div>
                </div>

                {/* Right: Star (fixed position) */}
                <FavoriteStar
                  isFavorited={isFavorited}
                  onClick={() => onToggleFavorite(investor.id)}
                />
              </div>

              {/* ---------- STATS GRID ---------- */}
              <div className="mx-auto">
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-x-8 gap-y-4

                    md:gap-x-30
                    md:gap-y-6
                    lg:grid-cols-none
                    lg:grid-flow-col
                    lg:auto-cols-[minmax(10rem,1fr)]
                    lg:gap-x-10

                      "
                >
                  <Stat
                    label="Latest Inv. "
                    value={
                      investor.mostRecentInvestmentCompany ?? "Undisclosed"
                    }
                    investorID={investor.id}
                  />
                  <Stat
                    label="Latest Inv. Date"
                    value={investor.mostRecentInvestmentDate ?? "—"}
                    investorID={investor.id}
                  />
                  <Stat
                    label="Total Inv."
                    value={investor.totalInvestments?.toLocaleString()}
                    investorID={investor.id}
                  />
                  <Stat
                    label="Avg. Check"
                    value={
                      investor.averageInvestmentSize
                        ? `$${investor.averageInvestmentSize.toLocaleString()}`
                        : "—"
                    }
                    investorID={investor.id}
                  />
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  );
}

/* ---------- Stat helper ---------- */

function Stat({
  label,
  value,
  investorID,
}: {
  label: string;
  value: string;
  investorID: number;
}) {
  return (
    <div className="flex flex-col text-center min-w-0">
      <span className="text-[11px] md:text-xs text-gray-500 tracking-light tabular-nums">
        {label}
      </span>
      <div className="text-lg">
        {label.toLocaleLowerCase() === "avg. check" ? (
          <Link href={`/investor-profile/${investorID}`}>
            <span className="text-green-600 text-xl tracking-light hover:underline cursor-pointer tabular-nums">
              {value}
            </span>
          </Link>
        ) : (
          <Link href={`/investor-profile/${investorID}`}>
            <span className="text-black text-xl tracking-light hover:underline cursor-pointer tabular-nums ">
              {value}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

/* ----- Star Component ----- */

import { Star } from "lucide-react";
type FavoriteStarProps = {
  isFavorited: boolean;
  onClick: () => void;
};

export function FavoriteStar({ isFavorited, onClick }: FavoriteStarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle favorite investor"
      className="
        p-1 rounded
        transition
        hover:bg-yellow-100
        focus:outline-none
      "
    >
      <Star
        className={`h-6 w-6 transition ${
          isFavorited ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
        }`}
      />
    </button>
  );
}
