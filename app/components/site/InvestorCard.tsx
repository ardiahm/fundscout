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
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-4">
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
          </CardTitle>
        </CardHeader>
      </Card>
    </>
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
