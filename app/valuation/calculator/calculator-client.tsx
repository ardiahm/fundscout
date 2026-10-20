"use client";

import ValuationForm from "@/app/components/site/valuation/valuation-form";

export default function ValuationCalculatorClient({ sectors }: { sectors: string[] }) {
  return (
    <div className="flex min-h-screen w-full overflow-y-auto justify-center">
      <div className="w-full max-w-4xl">
        <ValuationForm sectors={sectors} />
      </div>
    </div>
  );
}
