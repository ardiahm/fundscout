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
  GeneratedOutreach
} from "@/backend/types/outreach";
import { formatOutreachSubmissionForGemini, FormattedOutreachSubmission } from "@/backend/constants/outreach";

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
  outreachSubmission: OutreachSubmission,
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

  try {

    const formattedUserSubmission = formatOutreachSubmissionForGemini(outreachSubmission);

    const geminiRawResponse = await sendSubmissionToGemini(formattedUserSubmission);

    
  }

  
}


async function sendSubmissionToGemini(submission: FormattedOutreachSubmission): Promise<string> {
  console.log("OUTREACH GENERATION HIT");

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

  const prompt = `
You are an expert outreach and startup messaging strategist.

Your task is to generate exactly 1 polished outreach message based on the user's submission.

The message may be an email or a short message depending on the selected method.

The user submission includes the following fields:

Sender information:
- sender_name: the person sending the outreach
- sender_role: the sender's role or title
- sender_company: the sender's company, project, or organization
- sender_background: relevant context about the sender

Recipient information:
- recipient_name: the person receiving the outreach
- recipient_role: the recipient's role or title
- recipient_company: the recipient's company or organization
- recipient_industry: the recipient's industry

Outreach details:
- goal: the main purpose of the outreach
  Possible values:
  - Book a meeting
  - Ask for advice
  - Pitch a product/service
  - Follow up
  - Network
  - Recruiting/job opportunity
  - Partnership
  - Other

- method: the format of the outreach
  Possible values:
  - Email
  - Message (LinkedIn or Mobile)

- relationship: the sender's relationship to the recipient
  Possible values:
  - Cold outreach
  - Met before
  - Referred by someone
  - Existing customer/client
  - Past conversation
  - Friend/acquaintance

- relationship_context: extra details about the relationship, referral, previous meeting, or past conversation

Message context:
- reason_for_reaching_out: the specific reason the sender is contacting this recipient

Call to action:
- call_to_action: what the sender wants the recipient to do
  Possible values:
  - Schedule a call
  - Reply with interest
  - Give feedback
  - Try the product
  - Make an introduction
  - Answer a question
  - Other

- call_to_action_details: extra details about the ask, timing, meeting length, next step, or specific request

Style:
- tone: the desired tone of the message
  Possible values:
  - Professional
  - Casual
  - Friendly
  - Confident
  - Warm
  - Direct

- length: the desired length of the message
  Possible values:
  - Short
  - Medium
  - Detailed

Rules for missing information:
- If an optional field is missing, empty, or says "Not provided", do not mention that it is missing.
- Do not write placeholders like "[Recipient Name]", "[Company]", or "[Your Name]".
- If recipient_name is missing, use a natural greeting such as "Hi," for email or omit the greeting for short messages.
- If sender_company is missing, do not invent a company.
- If recipient_company is missing, do not invent a company.
- If relationship_context is missing, rely only on the selected relationship.
- If call_to_action_details is missing, create a simple, natural ask based only on the selected call_to_action.
- If sender_role or sender_background is missing, keep the sender introduction brief.
- If recipient_role, recipient_company, or recipient_industry is missing, keep the message broadly relevant without pretending to know specifics.

Writing rules:
- Make the message sound human, natural, and specific.
- Do not be overly salesy.
- Do not use vague buzzwords like "revolutionary", "cutting-edge", "game-changing", or "innovative".
- Do not invent facts that were not provided.
- Do not over-explain.
- Keep the message appropriate for the selected method.
- If method is "Message (LinkedIn or Mobile)", make it shorter, more conversational, and avoid email-style formatting.
- If method is "Email", include a subject line and a properly formatted email body.
- Match the selected tone.
- Match the selected length.
- The call to action should be clear and low-friction.

Formatting rules:
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include commentary before or after the JSON.

If method is "Email", return this exact JSON shape:

{
  "id": "generated-1",
  "subject": "Email subject here",
  "response": "Email body here"
}

If method is "Message (LinkedIn or Mobile)", return this exact JSON shape:

{
  "id": "generated-1",
  "response": "Message body here"
}

User submission:
${JSON.stringify(submission, null, 2)}
`;

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
  }
});

if (!response.text) {
  throw new Error("Gemini returned an empty response");
}

return response.text;
}
