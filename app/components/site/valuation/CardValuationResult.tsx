"use client";

import { Button } from "@/app/components/ui/button";
import {
  Popover,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { useTransition } from "react";
import { formatUSD } from "@/app/lib/utils";
import { valuationStageLabels } from "@/backend/constants/valuation";
import type {
  Comparables,
  ValuationInteraction,
  ValuationMethodResult,
} from "@/backend/types/valuation";

type CardValuationResultProps = {
  interaction: ValuationInteraction;
  deleteAction: (interactionId: string) => Promise<void>;
};

const usd = (value: number) => formatUSD(value, { compact: true });

export function CardValuationResult({
  interaction,
  deleteAction,
}: CardValuationResultProps) {
  const [isPending, startTransition] = useTransition();

  const submission = interaction.submission;
  const companyName = submission?.companyName || "Unnamed startup";
  const { low, mid, high, methods, comparables, writeUp } = interaction.response;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl flex min-w-0 justify-between gap-2">
          <div className="min-w-0 truncate font-medium" title={companyName}>
            {companyName}
          </div>
          <div className="shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">X</Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="max-w-40">
                <PopoverHeader>
                  <PopoverTitle>Are you sure?</PopoverTitle>
                  <PopoverDescription className="flex pt-2">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      variant="destructive"
                      onClick={() => {
                        startTransition(async () => {
                          await deleteAction(interaction.id);
                        });
                      }}
                    >
                      {isPending ? "Deleting..." : "I want to delete"}
                    </Button>
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          </div>
        </CardTitle>
        <CardDescription>
          <span className="font-light">Date: </span>
          <span className="font-medium">
            {interaction.createdAt?.toLocaleDateString()}
          </span>
          {submission && (
            <>
              <span className="font-light"> · </span>
              <span className="font-medium">
                {valuationStageLabels[submission.stage]}
              </span>
              <span className="font-light"> · </span>
              <span className="font-medium">{submission.sector}</span>
              <span className="font-light"> · Raising </span>
              <span className="font-medium">{usd(submission.raiseAmount)}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-6">
        {/* ================= Range ================= */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:p-6">
          <p className="text-sm font-semibold text-emerald-700">
            Estimated pre-money valuation
          </p>
          <p className="pt-1 text-3xl font-bold tracking-tight text-black sm:text-4xl">
            {usd(low)} – {usd(high)}
          </p>
          <p className="pt-1 text-emerald-700">
            Midpoint <span className="font-semibold">{usd(mid)}</span>
          </p>
          <RangeBar low={low} high={high} mid={mid} methods={methods} />
        </div>

        {/* ================= Methods ================= */}
        <div className="grid gap-4">
          <p className="text-sm font-light">How we got there</p>
          {methods.map((method) => (
            <div key={method.key} className="grid gap-1">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium">{method.label}</span>
                <span className="shrink-0 font-semibold text-emerald-600">
                  {usd(method.value)}
                </span>
              </div>
              <p className="m-0 text-sm text-muted-foreground">{method.explanation}</p>
            </div>
          ))}
        </div>

        <ComparablesPanel comparables={comparables} />

        {/* ================= Write-up ================= */}
        <div className="grid gap-3">
          <p className="text-sm font-light">What&apos;s behind the number</p>
          {writeUp ? (
            <>
              <p className="m-0 leading-7">{writeUp.summary}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <WriteUpList title="Helping you" items={writeUp.drivers} />
                <WriteUpList title="Holding you back" items={writeUp.risks} />
              </div>
            </>
          ) : (
            <p className="m-0 text-sm text-muted-foreground">
              Write-up unavailable for this valuation.
            </p>
          )}
        </div>

        <p className="m-0 text-xs text-muted-foreground">
          An estimate from rules of thumb and past rounds, not financial advice.
          Real valuations come down to negotiation with investors.
        </p>
      </CardContent>
    </Card>
  );
}

// a line from low to high, with a dot for each method and a marker at the midpoint
function RangeBar({
  low,
  high,
  mid,
  methods,
}: {
  low: number;
  high: number;
  mid: number;
  methods: ValuationMethodResult[];
}) {
  const spread = high - low;
  const position = (value: number) =>
    spread === 0 ? 50 : ((value - low) / spread) * 100;

  return (
    <div className="relative mt-5 mb-1 h-2 rounded-full bg-emerald-200" aria-hidden>
      {methods.map((method) => (
        <span
          key={method.key}
          title={`${method.label}: ${usd(method.value)}`}
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 ring-2 ring-emerald-50"
          style={{ left: `${position(method.value)}%` }}
        />
      ))}
      <span
        className="absolute top-1/2 h-5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-700"
        style={{ left: `${position(mid)}%` }}
      />
    </div>
  );
}

function ComparablesPanel({ comparables }: { comparables: Comparables }) {
  const { source, sampleSize, stageLabel, sector, medianRound, p25Round, p75Round, examples } =
    comparables;

  const heading =
    source === "benchmark"
      ? `Not enough ${stageLabel} rounds on FundScout yet${sampleSize ? ` (${sampleSize} so far)` : ""}, so this uses a market benchmark.`
      : `Based on ${sampleSize} ${stageLabel}${sector ? ` ${sector}` : ""} rounds on FundScout.`;

  return (
    <div className="grid gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4">
      <p className="m-0 text-sm font-medium">{heading}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="m-0 text-muted-foreground">Typical round</p>
          <p className="m-0 font-semibold">{usd(medianRound)}</p>
        </div>
        <div>
          <p className="m-0 text-muted-foreground">Middle half</p>
          <p className="m-0 font-semibold">
            {usd(p25Round)} – {usd(p75Round)}
          </p>
        </div>
      </div>
      {examples.length > 0 && (
        <div className="grid gap-1 text-sm">
          <p className="m-0 text-muted-foreground">Recent {stageLabel} rounds</p>
          {examples.map((round) => (
            <div
              key={`${round.companyName}-${round.investedAt}`}
              className="flex min-w-0 justify-between gap-4"
            >
              <span className="min-w-0 truncate" title={round.companyName}>
                {round.companyName}
              </span>
              <span className="shrink-0 tabular-nums">
                {usd(round.amount)}
                {round.investedAt && (
                  <span className="text-muted-foreground">
                    {" "}
                    · {new Date(round.investedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WriteUpList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="grid gap-2">
      <p className="m-0 text-sm font-medium">{title}</p>
      <ul className="m-0 grid list-disc gap-1 pl-5 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
