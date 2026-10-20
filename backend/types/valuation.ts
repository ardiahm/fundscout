import { ValuationStage } from "@/backend/lib/generated/prisma/enums";

export type ValuationSubmission = {
  id: string;

  companyName: string | null;
  stage: ValuationStage;
  sector: string;
  raiseAmount: number;

  // only filled in when the startup has revenue
  hasRevenue: boolean;
  monthlyRevenue: number | null;
  monthlyGrowth: number | null;
  grossMargin: number | null;

  // 1-5 self ratings
  teamRating: number;
  marketRating: number;
  productRating: number;
  competitionRating: number;
  tractionRating: number;
};

export type ValuationMethodKey =
  | "comparables"
  | "scorecard"
  | "berkus"
  | "revenueMultiple"
  | "targetDilution";

export type ValuationMethodResult = {
  key: ValuationMethodKey;
  label: string;
  // pre-money, in USD
  value: number;
  explanation: string;
};

// where the comparable round sizes came from, most to least specific
export type ComparablesSource = "stage-and-sector" | "stage" | "benchmark";

export type ComparableRound = {
  companyName: string;
  amount: number;
  investedAt: string | null;
};

export type Comparables = {
  source: ComparablesSource;
  stageLabel: string;
  sector: string | null;
  sampleSize: number;
  medianRound: number;
  p25Round: number;
  p75Round: number;
  // FundScout's median mixed with the market benchmark; this is what the math uses
  blendedRound: number;
  // how much of blendedRound comes from FundScout (0-1). Missing on early saved results
  fundScoutShare?: number;
  examples: ComparableRound[];
};

export type ValuationWriteUp = {
  summary: string;
  drivers: string[];
  risks: string[];
};

export type ValuationResult = {
  // pre-money range, in USD
  low: number;
  mid: number;
  high: number;
  methods: ValuationMethodResult[];
  comparables: Comparables;
  // null when Gemini failed or the daily write-up limit was reached
  writeUp: ValuationWriteUp | null;
};

export type ValuationInteraction = {
  id: string;
  submission: ValuationSubmission | null;
  response: ValuationResult;
  createdAt: Date;
};

export type ValuationHistory = {
  interactions: ValuationInteraction[];
};
