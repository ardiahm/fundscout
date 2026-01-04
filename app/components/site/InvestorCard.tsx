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
            <div className="flex flex-w-full justify-between">
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
                <div className="flex flex-col gap-1">
                  <Link href={`/investor-profile/${investor.id}`}>
                    <span className="font-medium text-gray-900 hover:underline cursor-pointer">
                      {investor.name}
                    </span>
                  </Link>
                  <div className="text-xs text-gray-600">{investor.type}</div>
                </div>
              </div>
              {/* Stat Container */}
              <div
                className="
    mt-4
    grid grid-cols-2 gap-x-6 gap-y-3
    text-right
    sm:grid-cols-2 sm:text-right sm:py-1 sm:gap-y-6
    md:grid-cols-2 md:gap-6 md:ml-auto md:pr-10 md:text-right
    lg:flex lg:gap-x-12
  "
              >
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
      <span className="text-xs text-gray-500">{label}</span>
      {label.toLocaleLowerCase() === "avg. check" ? (
        <span className="font-medium text-green-600">{value}</span>
      ) : (
        <span className="font-medium text-black">{value}</span>
      )}
    </div>
  );
}
