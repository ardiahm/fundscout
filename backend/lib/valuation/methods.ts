import {
  BERKUS_FACTOR_MAX,
  HIGH_MARGIN,
  LOW_MARGIN,
  MARGIN_ADJUSTMENT,
  REVENUE_MULTIPLE_BANDS,
  SCORECARD_WEIGHTS,
  STAGE_DILUTION,
} from "@/backend/constants/valuation";
import { formatUSD } from "@/app/lib/utils";
import type {
  Comparables,
  ValuationMethodResult,
  ValuationSubmission,
} from "@/backend/types/valuation";

export type ValuationInputs = Omit<ValuationSubmission, "id">;

export type ValuationRange = {
  low: number;
  mid: number;
  high: number;
  methods: ValuationMethodResult[];
};

const usd = (value: number) => formatUSD(value, { compact: true });

// keep numbers readable, e.g. 4,237,118 -> 4,240,000
function tidy(value: number) {
  return Number(value.toPrecision(3));
}

// raising `round` while selling `dilution` of the company implies this pre-money
function preMoneyFromRound(round: number, dilution: number) {
  return (round * (1 - dilution)) / dilution;
}

// rating 1 -> 0.5x, 3 -> 1x, 5 -> 1.5x
export function ratingMultiplier(rating: number) {
  return 0.5 + (rating - 1) * 0.25;
}

export function comparablesMethod(
  inputs: ValuationInputs,
  comparables: Comparables,
): ValuationMethodResult {
  const dilution = STAGE_DILUTION[inputs.stage];
  const value = tidy(preMoneyFromRound(comparables.medianRound, dilution));
  const percent = Math.round(dilution * 100);

  const sample =
    comparables.source === "benchmark"
      ? `FundScout doesn't have enough ${comparables.stageLabel} rounds yet, so this uses a typical market round of ${usd(comparables.medianRound)}`
      : `The typical ${comparables.stageLabel}${comparables.sector ? ` ${comparables.sector}` : ""} round on FundScout is ${usd(comparables.medianRound)} (${comparables.sampleSize} rounds)`;

  return {
    key: "comparables",
    label: "Comparable rounds",
    value,
    explanation: `${sample}. Selling about ${percent}% in that round implies this pre-money.`,
  };
}

export function scorecardMethod(
  inputs: ValuationInputs,
  baseline: number,
): ValuationMethodResult {
  const factor =
    SCORECARD_WEIGHTS.team * ratingMultiplier(inputs.teamRating) +
    SCORECARD_WEIGHTS.market * ratingMultiplier(inputs.marketRating) +
    SCORECARD_WEIGHTS.product * ratingMultiplier(inputs.productRating) +
    SCORECARD_WEIGHTS.competition * ratingMultiplier(inputs.competitionRating) +
    SCORECARD_WEIGHTS.traction * ratingMultiplier(inputs.tractionRating);

  return {
    key: "scorecard",
    label: "Scorecard",
    value: tidy(baseline * factor),
    explanation: `Your ratings put you at ${factor.toFixed(2)}× a typical company at your stage, weighted most heavily on team and market.`,
  };
}

// pre-revenue Pre-Seed and Seed only
export function berkusMethod(inputs: ValuationInputs): ValuationMethodResult | null {
  const factorMax = BERKUS_FACTOR_MAX[inputs.stage];
  if (inputs.hasRevenue || !factorMax) return null;

  const ratings = [
    inputs.marketRating,
    inputs.productRating,
    inputs.teamRating,
    inputs.competitionRating,
    inputs.tractionRating,
  ];

  // rating 1 adds nothing, rating 5 adds the full amount
  const value = ratings.reduce((sum, r) => sum + ((r - 1) / 4) * factorMax, 0);
  if (value <= 0) return null;

  return {
    key: "berkus",
    label: "Berkus",
    value: tidy(value),
    explanation: `Five factors (idea, product, team, edge, traction) each add up to ${usd(factorMax)} for a pre-revenue startup.`,
  };
}

export function annualGrowth(monthlyGrowthPercent: number) {
  return (1 + monthlyGrowthPercent / 100) ** 12 - 1;
}

export function revenueMultiple(annualGrowthRate: number, grossMargin: number) {
  const band = REVENUE_MULTIPLE_BANDS.find((b) => annualGrowthRate < b.maxAnnualGrowth)!;

  let adjustment = 1;
  if (grossMargin >= HIGH_MARGIN) adjustment += MARGIN_ADJUSTMENT;
  if (grossMargin < LOW_MARGIN) adjustment -= MARGIN_ADJUSTMENT;

  return band.multiple * adjustment;
}

export function revenueMultipleMethod(
  inputs: ValuationInputs,
): ValuationMethodResult | null {
  const { hasRevenue, monthlyRevenue, monthlyGrowth, grossMargin } = inputs;
  if (!hasRevenue || monthlyRevenue == null || monthlyGrowth == null || grossMargin == null) {
    return null;
  }

  const arr = monthlyRevenue * 12;
  const growth = annualGrowth(monthlyGrowth);
  const multiple = revenueMultiple(growth, grossMargin);

  return {
    key: "revenueMultiple",
    label: "Revenue multiple",
    value: tidy(arr * multiple),
    explanation: `${usd(arr)} in annual revenue × ${multiple.toFixed(1)}, for growing about ${Math.round(growth * 100)}% a year at a ${Math.round(grossMargin)}% gross margin.`,
  };
}

export function targetDilutionMethod(inputs: ValuationInputs): ValuationMethodResult {
  const dilution = STAGE_DILUTION[inputs.stage];

  return {
    key: "targetDilution",
    label: "Your raise",
    value: tidy(preMoneyFromRound(inputs.raiseAmount, dilution)),
    explanation: `Raising ${usd(inputs.raiseAmount)} for about ${Math.round(dilution * 100)}% of the company, the usual amount to sell at your stage.`,
  };
}

function median(sortedValues: number[]) {
  const middle = Math.floor(sortedValues.length / 2);

  return sortedValues.length % 2
    ? sortedValues[middle]
    : (sortedValues[middle - 1] + sortedValues[middle]) / 2;
}

// runs every method that applies and turns them into a low / mid / high range
export function computeValuation(
  inputs: ValuationInputs,
  comparables: Comparables,
): ValuationRange {
  const comparable = comparablesMethod(inputs, comparables);

  const methods = [
    comparable,
    scorecardMethod(inputs, comparable.value),
    berkusMethod(inputs),
    revenueMultipleMethod(inputs),
    targetDilutionMethod(inputs),
  ].filter((method): method is ValuationMethodResult => method !== null);

  const values = methods.map((method) => method.value).sort((a, b) => a - b);

  return {
    low: values[0],
    mid: tidy(median(values)),
    high: values[values.length - 1],
    methods,
  };
}
