"use server";

import { GoogleGenAI } from "@google/genai";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import "dotenv/config";
import {
  checkRateLimit,
  getRateLimitStatus,
} from "@/backend/server/rate-limit/rateLimit";
import { getComparables, getSectorNames } from "@/backend/server/valuation/getComparables";
import { computeValuation, type ValuationInputs } from "@/backend/lib/valuation/methods";
import {
  valuationFormSchema,
  valuationStageLabels,
  type ValuationFormValues,
} from "@/backend/constants/valuation";
import type {
  ValuationResult,
  ValuationWriteUp,
} from "@/backend/types/valuation";
import { formatUSD } from "@/app/lib/utils";

const WRITE_UP_ACTION = "valuation-writeup";
const WRITE_UP_LIMIT = 4;
const WRITE_UP_WINDOW_MS = 24 * 60 * 60 * 1000;

const GeminiWriteUpSchema = z.object({
  summary: z.string().min(20, "Summary is too short.").max(800, "Summary is too long."),
  drivers: z.array(z.string().min(3).max(300)).min(1).max(5),
  risks: z.array(z.string().min(3).max(300)).min(1).max(5),
});

type CalculateValuationSuccess = {
  success: true;
  data: ValuationResult;
  // write-ups left today, or a reason the write-up is missing
  remaining: number;
  writeUpError?: string;
};

type CalculateValuationError = {
  success: false;
  error: string;
};

type CalculateValuationResult = CalculateValuationSuccess | CalculateValuationError;

export default async function calculateValuation(
  submission: ValuationFormValues,
): Promise<CalculateValuationResult> {
  // verify user
  const user = await ensureUser();

  const userId = user.id;
  if (!userId) {
    return {
      success: false,
      error: "You must be signed in to calculate a valuation",
    };
  }

  // verify submission with the same schema the form uses
  const validatedSubmission = valuationFormSchema.safeParse(submission);
  if (!validatedSubmission.success) {
    return {
      success: false,
      error: "Missing or invalid valuation details",
    };
  }

  const sectors = await getSectorNames();
  if (!sectors.includes(validatedSubmission.data.sector)) {
    return {
      success: false,
      error: "Please select a sector from the list",
    };
  }

  const inputs = toValuationInputs(validatedSubmission.data);

  try {
    // the number never depends on Gemini
    const comparables = await getComparables(inputs.stage, inputs.sector);
    const range = computeValuation(inputs, comparables);

    const result: ValuationResult = { ...range, comparables, writeUp: null };

    const writeUp = await tryWriteUp(userId, inputs, result);
    result.writeUp = writeUp.writeUp;

    await saveValuation(userId, inputs, result);

    return {
      success: true,
      data: result,
      remaining: writeUp.remaining,
      ...(writeUp.error ? { writeUpError: writeUp.error } : {}),
    };
  } catch (err) {
    console.error("Failed to calculate valuation: ", err);
    return {
      success: false,
      error: "Something went wrong while calculating your valuation",
    };
  }
}

// revenue fields only count when the startup has revenue
function toValuationInputs(values: ValuationFormValues): ValuationInputs {
  return {
    companyName: values.companyName || null,
    stage: values.stage,
    sector: values.sector,
    raiseAmount: values.raiseAmount,

    hasRevenue: values.hasRevenue,
    monthlyRevenue: values.hasRevenue ? (values.monthlyRevenue ?? null) : null,
    monthlyGrowth: values.hasRevenue ? (values.monthlyGrowth ?? null) : null,
    grossMargin: values.hasRevenue ? (values.grossMargin ?? null) : null,

    teamRating: values.teamRating,
    marketRating: values.marketRating,
    productRating: values.productRating,
    competitionRating: values.competitionRating,
    tractionRating: values.tractionRating,
  };
}

// best effort: a failed or rate-limited write-up still returns the valuation
async function tryWriteUp(
  userId: string,
  inputs: ValuationInputs,
  result: ValuationResult,
): Promise<{ writeUp: ValuationWriteUp | null; remaining: number; error?: string }> {
  const rateLimitKey = `user:${userId}`;

  const status = await getRateLimitStatus({
    key: rateLimitKey,
    action: WRITE_UP_ACTION,
    limit: WRITE_UP_LIMIT,
  });

  if (!status.allowed) {
    return {
      writeUp: null,
      remaining: 0,
      error: `You've used today's write-ups. Your valuation is saved without one; write-ups reset on ${status.resetAt?.toLocaleDateString()}.`,
    };
  }

  try {
    const raw = await sendValuationToGemini(inputs, result);
    const writeUp = parseGeminiWriteUp(raw);

    // only count write-ups that worked
    const rateLimit = await checkRateLimit({
      key: rateLimitKey,
      action: WRITE_UP_ACTION,
      limit: WRITE_UP_LIMIT,
      windowMs: WRITE_UP_WINDOW_MS,
    });

    return { writeUp, remaining: rateLimit.remaining };
  } catch (err) {
    console.error("Valuation write-up failed: ", err);
    return {
      writeUp: null,
      remaining: status.remaining,
      error: "The write-up isn't available right now, but your valuation is saved.",
    };
  }
}

async function sendValuationToGemini(
  inputs: ValuationInputs,
  result: ValuationResult,
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const usd = (value: number) => formatUSD(value, { compact: true });

  const details = {
    company: inputs.companyName ?? "Unnamed startup",
    stage: valuationStageLabels[inputs.stage],
    sector: inputs.sector,
    raising: usd(inputs.raiseAmount),
    revenue: inputs.hasRevenue
      ? {
          monthlyRevenue: usd(inputs.monthlyRevenue ?? 0),
          monthlyGrowthPercent: inputs.monthlyGrowth,
          grossMarginPercent: inputs.grossMargin,
        }
      : "pre-revenue",
    selfRatingsOutOf5: {
      team: inputs.teamRating,
      market: inputs.marketRating,
      product: inputs.productRating,
      competitiveEdge: inputs.competitionRating,
      traction: inputs.tractionRating,
    },
    preMoneyRange: {
      low: usd(result.low),
      mid: usd(result.mid),
      high: usd(result.high),
    },
    methods: result.methods.map((method) => ({
      method: method.label,
      value: usd(method.value),
      how: method.explanation,
    })),
    comparables:
      result.comparables.source === "benchmark"
        ? "Not enough FundScout rounds at this stage; a market benchmark was used."
        : `${result.comparables.sampleSize} ${result.comparables.stageLabel} rounds on FundScout, median ${usd(result.comparables.medianRound)}.`,
  };

  const prompt = `
You are an experienced startup advisor explaining a valuation estimate to a founder.

The valuation has already been calculated. Your job is only to explain it.

Rules:
- Do not propose, change or add any valuation numbers. You may refer to the numbers given.
- Explain why the range sits where it does, based on the methods and the founder's inputs.
- Name the inputs that pull the valuation up (drivers) and the ones that hold it back or make it uncertain (risks).
- Be specific to this startup. Do not use buzzwords or generic advice.
- Keep the summary to 2-3 sentences. Give 2-4 drivers and 2-4 risks, each one sentence.
- Return ONLY valid JSON, with no markdown and no commentary.

Return this exact JSON shape:

{
  "summary": "2-3 sentence explanation",
  "drivers": ["one sentence", "one sentence"],
  "risks": ["one sentence", "one sentence"]
}

Valuation details:
${JSON.stringify(details, null, 2)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      abortSignal: AbortSignal.timeout(20_000),
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  return response.text;
}

function parseGeminiWriteUp(rawResponse: string): ValuationWriteUp {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawResponse);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  const validationResult = GeminiWriteUpSchema.safeParse(parsedJson);

  if (!validationResult.success) {
    console.error("Gemini write-up failed validation: ", validationResult.error);
    throw new Error("Gemini response did not match the expected format.");
  }

  return validationResult.data;
}

async function saveValuation(
  userId: string,
  inputs: ValuationInputs,
  result: ValuationResult,
) {
  const interaction = {
    response: result,
    submission: { create: inputs },
  };

  // either add to the user's existing valuation history or create it
  await prisma.valuationHistory.upsert({
    where: { userId },
    update: { interactions: { create: interaction } },
    create: { userId, interactions: { create: interaction } },
  });
}
