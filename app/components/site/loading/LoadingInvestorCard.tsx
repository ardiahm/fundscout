import { InvestorComplete } from "../../../../backend/types/investor";
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

export function LoadingInvestorCard() {
  const loadingStat = "Loading Stat";
  const loadingType = "Loading Type";

  return (
    <>
      <Card className="bg-sky-100/20 transition delay-20 hover:bg-sky-100/80 ">
        <CardHeader>
          <CardTitle>
            {/* Avatar, Name, Type, Star, and Stats Container */}
            <div className="my-3">
              <div className="flex w-full justify-between items-start">
                {/* Avatar, Name, Type, and Star Container */}
                <div className="flex items-center w-max gap-4 pt-1 ">
                  {/* Avatar */}
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full object-cover" />
                  </div>
                  {/* Name and Type */}
                  <div className="flex flex-col ">
                    <span className="text-lg font-medium text-gray-900 hover:underline cursor-pointer">
                      Loading
                    </span>
                    <div className="text-xs text-gray-600">{loadingType}</div>
                  </div>
                  {/* Star */}
                  <div className="ml-auto">
                    <FavoriteStar />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-x-12 max-w-container mx-10 pt-2">
                  <Stat label="Avg. Check" value={loadingStat} />
                  <Stat label="Latest Inv. Company" value={loadingStat} />
                  <Stat label="Latest Inv. Date" value={loadingStat} />
                  <Stat label="Total Inv." value={loadingStat} />
                </div>
              </div>
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
      <div className="text-lg">
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

export function FavoriteStar() {
  "use client";

  return (
    <button
      type="button"
      aria-label="Toggle favorite investor"
      className="
        p-1 rounded
        transition
        hover:bg-yellow-100 
        disabled:opacity-60
      "
    >
      <Star
        className={`h-5 w-5 transition Ç
         "fill-yellow-400 text-yellow-400" 
        }`}
      />
    </button>
  );
}
