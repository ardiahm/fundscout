import { InvestorComplete } from "../../../backend/types/investor";
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

type Props = {
  investor: InvestorComplete;
};

export function InvestorCard({ investor }: Props) {
  return (
    <>
      <Card className="bg-sky-100/20 transition delay-20 hover:bg-sky-100/80 ">
        <CardHeader>
          <CardTitle>
            {/* Avatar, Name, Type, Star Container */}
            <div>
              <div className="flex w-full justify-between items-start">
                {/* Avatar, Name, Type Container */}
                <div className="flex items-center w-max gap-4 pt-1 ">
                  {/* Avatar */}
                  <div className="flex items-center">
                    {investor.avatarUrl ? (
                      <img
                        src={investor.avatarUrl}
                        alt={investor.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                        {investor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                  </div>
                  {/* Name and Type */}
                  <div className="flex flex-col ">
                    <Link href={`/investor-profile/${investor.id}`}>
                      <span className="text-lg font-medium text-gray-900 hover:underline cursor-pointer">
                        {investor.name}
                      </span>
                    </Link>
                    <div className="text-xs text-gray-600">{investor.type}</div>
                  </div>
                </div>
                <div className="ml-auto">
                  <FavoriteStar
                    investorId={investor.id}
                    initiallyFavorited={investor.isFavorited}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-x-12 max-w-container mx-40 pt-8 pb-4">
              <Stat
                label="Avg. Check"
                value={
                  investor.averageInvestmentSize
                    ? `$${investor.averageInvestmentSize.toLocaleString()}`
                    : "—"
                }
              />
              <Stat
                label="Latest Inv. Company"
                value={investor.mostRecentInvestmentCompany ?? "Undisclosed"}
              />
              <Stat
                label="Latest Inv. Date"
                value={
                  investor.mostRecentInvestmentDate
                    ? investor.mostRecentInvestmentDate.toLocaleDateString()
                    : "—"
                }
              />
              <Stat
                label="Total Inv."
                value={investor.totalInvestments.toString()}
              />
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  );
}

/* ---------- Small helper ---------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col text-right min-w-0">
      <span className="text-xs text-gray-500 tracking-light tabular-nums">
        {label}
      </span>
      <div className="text-xl">
        {label.toLocaleLowerCase() === "avg. check" ? (
          <span className="text-green-600 tracking-light tabular-nums">
            {value}
          </span>
        ) : (
          <span className="text-black tracking-light tabular-nums">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

/* ----- Star Component ----- */

import { Star } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleFavoriteInvestor } from "@/app/lib/favorites/toggleFavoriteInvestor";

type FavoriteStarProps = {
  investorId: number;
  initiallyFavorited: boolean;
};

export function FavoriteStar({
  investorId,
  initiallyFavorited,
}: FavoriteStarProps) {
  "use client";
  const [isFavorited, setIsFavorited] = useState(initiallyFavorited);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const prev = isFavorited;

      // optimistic UI
      setIsFavorited(!prev);

      try {
        console.log("toggled favorite: " + investorId);
        await toggleFavoriteInvestor({ investorId });
      } catch (err) {
        // rollback on failure
        setIsFavorited(prev);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label="Toggle favorite investor"
      className="
        p-1 rounded
        transition
        hover:bg-yellow-100
        disabled:opacity-60
      "
    >
      <Star
        className={`h-5 w-5 transition ${
          isFavorited ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
        }`}
      />
    </button>
  );
}
