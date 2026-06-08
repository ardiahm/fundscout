"use server";

import { GoogleGenAI } from "@google/genai";
import type {
  OneLinerSubmission,
  GeneratedOneLiner,
  OneLinerResponse,
} from "@/backend/types/oneliner";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import "dotenv/config";
import { checkRateLimit } from "@/backend/server/rate-limit/rateLimit";
import {
  OutreachGoal,
  OutreachMethod,
  OutreachRelationship,
  OutreachCallToAction,
  OutreachTone,
  OutreachLength,
} from "@/backend/lib/generated/prisma/client";
import {
  OutreachSubmission,
  GeneratedOutreach,
} from "@/backend/types/outreach";

const GeminiGeneratedOutReachSchema = z.object({
  response: z
    .string()
    .min(10, "Response is too short.")
    .max(512, "Outreach is too long."),
});

type OutreachSubmissionInput = Omit<OutreachSubmission, "id">;

type OutreachGeminiSuccess = {
  success: true;
  data: GeneratedOutreach;
  remaining: number;
};

type OutreachGeminiError = {
  success: false;
  error: string;
};

type OutreachGeminiResult = OutreachGeminiSuccess | OutreachGeminiError;

export default async function OutreachGeminiCommunication(
  outreachSubmission: OutreachSubmissionInput,
): Promise<OutreachGeminiResult> {
  console.log("SERVER GENERATE OUTREACH STARTED");

  // verify user
  const user = await ensureUser();
  console.log("ENSURE USER DONE");

  const userId = user.id;
  if (!userId) {
    return {
      success: false,
      error: "You must be signed in to generate one-liners",
    };
  }

  if (!outreachSubmission) {
    return {
      success: false,
      error: "Missing outreach submission",
    };
  }

  console.log("Outreach submission received");

  const rateLimitKey = `user:${userId}`;

  const rateLimit = await checkRateLimit({
    key: rateLimitKey,
    action: "generate-outreach",
    limit: 4,
    windowMs: 24 * 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `You have reached your generation limit. Try again on ${rateLimit.resetAt.toLocaleDateString()} at ${rateLimit.resetAt.toLocaleTimeString()}.`,
    };
  }

  
}
