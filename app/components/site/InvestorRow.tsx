import { InvestorSummary } from "../../../backend/types/investor";
import Link from "next/link";

type Props = {
  investor: InvestorSummary;
};

export function InvestorRow({ investor }: Props) {
  return (
    <div className="flex items-center justify-between rounded-md bg-blue-50 px-4 py-3 hover:bg-blue-100 transition">
      {/* LEFT: Avatar + Name */}
      <div className="flex items-center gap-3 min-w-[240px]">
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

        <div className="flex flex-col">
          <Link href={`/investor-profile/${investor.id}`}>
            <span className="font-medium text-gray-900 hover:underline cursor-pointer">
              {investor.name}
            </span>
          </Link>
          <div className="text-xs text-gray-600">{investor.type}</div>
        </div>
      </div>

      {/* RIGHT: Stats */}
      <div className="flex items-center gap-10 text-sm text-gray-700">
        {/* Latest Investment */}
        <Stat
          label="Latest Investment"
          value={investor.mostRecentInvestmentCompany ?? "—"}
        />

        {/* Date */}
        <Stat
          label="Latest Investment Date"
          value={
            investor.mostRecentInvestmentDate
              ? investor.mostRecentInvestmentDate.toLocaleDateString()
              : "—"
          }
        />

        {/* Total Investments */}
        <Stat
          label="Investments"
          value={investor.totalInvestments.toString()}
        />

        {/* Avg Check */}
        <Stat
          label="Avg Check"
          value={
            investor.averageInvestmentSize
              ? `$${investor.averageInvestmentSize.toLocaleString()}`
              : "—"
          }
        />
      </div>
    </div>
  );
}

/* ---------- Small helper ---------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col text-right min-w-[120px]">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
