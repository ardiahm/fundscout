"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import type { InvestorComplete } from "../../../backend/types/investor";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import InvestorProfileCard from "@/app/components/site/investor-profile/InvestorProfileCard";
import InvestmentCards from "@/app/components/site/investor-profile/InvestmentCard";
import LargestInvestmentCard from "@/app/components/site/investor-profile/LargestInvestmentCard";
import MostRecentInvestmentCard from "@/app/components/site/investor-profile/MostRecentInvestmentCard";
import { toggleFavoriteInvestor } from "@/app/lib/favorites/toggleFavoriteInvestor";

interface Props {
  investor: InvestorComplete;
  initialFavoriteInvestorIDs: number[];
}

export default function InvestorClient({
  investor,
  initialFavoriteInvestorIDs,
}: Props) {
  if (!investor) {
    return <div className="p-6 text-gray-500">Investor not found.</div>;
  }

  const router = useRouter();

  const [favoriteIds, setFavoriteIds] = useState<number[]>(
    initialFavoriteInvestorIDs,
  );

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const toggleFavorite = async (investorId: number) => {
    setFavoriteIds((prev) =>
      prev.includes(investorId)
        ? prev.filter((id) => id !== investorId)
        : [...prev, investorId],
    );

    try {
      await toggleFavoriteInvestor(investorId);
    } catch (err) {
      // optional rollback if you want
      setFavoriteIds((prev) =>
        prev.includes(investorId)
          ? prev.filter((id) => id !== investorId)
          : [...prev, investorId],
      );
    }
  };

  return (
    <div className="max-w-screen mx-10 px-6 py-6 space-y-10">
      {/* ================= Investor Header ================= */}
      <header className="mb-6">
        <Button
          variant="link"
          className="flex items-center gap-2"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <InvestorProfileCard
          investor={investor}
          isFavorited={favoriteSet.has(investor.id)}
          onToggleFavorite={toggleFavorite}
        />
      </header>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-[6fr_4fr] space-x-5 space-y-5">
          <LargestInvestmentCard investor={investor} />
          <MostRecentInvestmentCard investor={investor} />
        </div>
      </section>

      {/* ================= Investments ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Browse all ({investor.investments.length}) tracked investments:
        </h2>

        <InvestmentCards investments={investor.investments} />
      </section>

      {/* ================= Debug (Optional) ================= */}
      <details className="bg-gray-50 p-4 rounded">
        <summary className="cursor-pointer font-medium">
          Raw Investor Data
        </summary>
        <pre className="mt-4 text-xs overflow-x-auto">
          {JSON.stringify(investor, null, 2)}
        </pre>
      </details>
    </div>
  );
}
