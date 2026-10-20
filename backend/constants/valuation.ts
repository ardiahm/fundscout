import { ValuationStage } from "@/backend/lib/generated/prisma/enums";
import * as z from "zod";

export const valuationStageLabels: Record<ValuationStage, string> = {
  [ValuationStage.PRE_SEED]: "Pre-Seed",
  [ValuationStage.SEED]: "Seed",
  [ValuationStage.SERIES_A]: "Series A",
  [ValuationStage.SERIES_B]: "Series B",
};

/* ---------- Valuation constants ----------
 * These are rules of thumb, not market data. They're kept in one place so
 * they're easy to tune as FundScout's own round data grows.
 */

// share of the company typically sold in a round at each stage
export const STAGE_DILUTION: Record<ValuationStage, number> = {
  [ValuationStage.PRE_SEED]: 0.2,
  [ValuationStage.SEED]: 0.2,
  [ValuationStage.SERIES_A]: 0.2,
  [ValuationStage.SERIES_B]: 0.18,
};

// typical round sizes, used when FundScout has too few rounds to compare
export const BENCHMARK_ROUND_SIZE: Record<ValuationStage, number> = {
  [ValuationStage.PRE_SEED]: 1_000_000,
  [ValuationStage.SEED]: 3_500_000,
  [ValuationStage.SERIES_A]: 12_000_000,
  [ValuationStage.SERIES_B]: 30_000_000,
};

// fewer FundScout rounds than this and we fall back to a broader sample
export const MIN_COMPARABLE_ROUNDS = 5;

// FundScout's rounds skew toward large funds, so blend them with the benchmark.
// FundScout's share = rounds / (rounds + this), e.g. 7 rounds -> 19%, 50 -> 62%
export const BLEND_PRIOR_ROUNDS = 30;

// with at least this many methods, drop the highest and lowest from the range
export const TRIM_RANGE_MIN_METHODS = 4;

// scorecard: how much each self rating moves the baseline
export const SCORECARD_WEIGHTS = {
  team: 0.3,
  market: 0.25,
  product: 0.15,
  competition: 0.1,
  traction: 0.2,
} as const;

// berkus: most each of the five factors can add, adjusted up for today's market.
// only used for pre-revenue Pre-Seed and Seed startups
export const BERKUS_FACTOR_MAX: Partial<Record<ValuationStage, number>> = {
  [ValuationStage.PRE_SEED]: 1_000_000,
  [ValuationStage.SEED]: 2_000_000,
};

// revenue multiple on ARR, picked by annual growth rate
export const REVENUE_MULTIPLE_BANDS = [
  { maxAnnualGrowth: 0.25, multiple: 4 },
  { maxAnnualGrowth: 0.5, multiple: 6 },
  { maxAnnualGrowth: 1, multiple: 9 },
  { maxAnnualGrowth: 2, multiple: 13 },
  { maxAnnualGrowth: Infinity, multiple: 18 },
] as const;

// gross margin moves the multiple up or down by 20%
export const HIGH_MARGIN = 70;
export const LOW_MARGIN = 40;
export const MARGIN_ADJUSTMENT = 0.2;

/* ---------- Ratings ---------- */

export type RatingName =
  | "teamRating"
  | "marketRating"
  | "productRating"
  | "competitionRating"
  | "tractionRating";

// question shown for each rating, with what 1 and 5 mean
export const ratingQuestions: Record<
  RatingName,
  { label: string; low: string; high: string }
> = {
  teamRating: {
    label: "How experienced is your team?",
    low: "First-time founders",
    high: "Repeat founders, deep expertise",
  },
  marketRating: {
    label: "How big is your market?",
    low: "Small niche",
    high: "Billions in reach",
  },
  productRating: {
    label: "How far along is your product?",
    low: "Idea",
    high: "Launched and loved",
  },
  competitionRating: {
    label: "How strong is your edge over competitors?",
    low: "Easy to copy",
    high: "Hard to catch",
  },
  tractionRating: {
    label: "How much traction do you have?",
    low: "None yet",
    high: "Strong, growing",
  },
};

/* ---------- Form schema ---------- */

const rating = z
  .number({ message: "Please pick a rating." })
  .int()
  .min(1, "Please pick a rating.")
  .max(5, "Please pick a rating.");

// shared by the valuation form (client) and calculateValuation (server)
export const valuationFormSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .max(100, "Company name cannot be more than 100 characters."),
    stage: z.enum(ValuationStage, { message: "Please select your stage." }),
    sector: z
      .string()
      .trim()
      .min(1, "Please select a sector.")
      .max(60, "Please select a sector."),
    raiseAmount: z
      .number({ message: "Enter how much you're raising." })
      .min(10_000, "Enter at least $10,000.")
      .max(1_000_000_000, "Enter at most $1B."),

    hasRevenue: z.boolean(),
    monthlyRevenue: z.number().optional(),
    monthlyGrowth: z.number().optional(),
    grossMargin: z.number().optional(),

    teamRating: rating,
    marketRating: rating,
    productRating: rating,
    competitionRating: rating,
    tractionRating: rating,
  })
  .superRefine((values, ctx) => {
    if (!values.hasRevenue) return;

    const { monthlyRevenue, monthlyGrowth, grossMargin } = values;

    if (monthlyRevenue === undefined || monthlyRevenue <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["monthlyRevenue"],
        message: "Enter your monthly revenue.",
      });
    } else if (monthlyRevenue > 100_000_000) {
      ctx.addIssue({
        code: "custom",
        path: ["monthlyRevenue"],
        message: "Enter at most $100M a month.",
      });
    }

    if (monthlyGrowth === undefined || monthlyGrowth < -50 || monthlyGrowth > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["monthlyGrowth"],
        message: "Enter monthly growth between -50% and 100%.",
      });
    }

    if (grossMargin === undefined || grossMargin < 0 || grossMargin > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["grossMargin"],
        message: "Enter a gross margin between 0% and 100%.",
      });
    }
  });

export type ValuationFormValues = z.infer<typeof valuationFormSchema>;
