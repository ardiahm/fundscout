"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

interface InvestmentCardsProps {
  investments: {
    id: number;
    amount: number | null;
    stage: string | null;
    investedAt: Date | null;
    company: {
      id: number;
      name: string;
      websiteUrl: string | null;
      description: string | null;
      logoUrl: string | null;
      location: string | null;
      sectors: {
        id: number;
        sector: {
          name: string;
        };
      }[];
    };
  }[];
}

export default function InvestmentCards({
  investments,
}: InvestmentCardsProps) {
  if (investments.length === 0) {
    return (
      <p className="text-gray-500">No investments recorded.</p>
    );
  }

  
  return (
    <div className="grid grid-cols-2 gap-4">
      {investments.map((inv) => (
        <Card key={inv.id}>
          <CardContent className="p-5 space-y-4">
            {/* Company Header */}
            <div className="flex items-center gap-4">
              {inv.company.logoUrl && (
                <img
                  src={inv.company.logoUrl}
                  alt={inv.company.name}
                  className="w-10 h-10 object-contain"
                />
              )}

              <div>
                <div className="font-medium text-lg">
                  {inv.company.name}
                </div>

                {inv.company.websiteUrl && (
                  <a
                    href={inv.company.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    {inv.company.websiteUrl}
                  </a>
                )}
              </div>
            </div>

            {/* Company Description */}
            {inv.company.description && (
              <p className="text-sm text-gray-600">
                {inv.company.description}
              </p>
            )}

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Amount</span>
                <div className="font-medium">
                  {inv.amount !== null
                    ? `$${inv.amount.toLocaleString()}`
                    : "Undisclosed"}
                </div>
              </div>

              <div>
                <span className="text-gray-500">Stage</span>
                <div className="font-medium">
                  {inv.stage ?? "—"}
                </div>
              </div>

              <div>
                <span className="text-gray-500">Invested At</span>
                <div className="font-medium">
                  {inv.investedAt
                    ? new Date(
                        inv.investedAt
                      ).toLocaleDateString()
                    : "—"}
                </div>
              </div>

              <div>
                <span className="text-gray-500">Location</span>
                <div className="font-medium">
                  {inv.company.location ?? "—"}
                </div>
              </div>
            </div>

            {/* Sectors */}
            {inv.company.sectors.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {inv.company.sectors.map((sector) => (
                  <span
                    key={sector.id}
                    className="text-xs px-2 py-1 bg-gray-100 rounded"
                  >
                    {sector.sector.name}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
