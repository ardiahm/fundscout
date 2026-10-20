"use server";

import { GoogleGenAI } from "@google/genai";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import "dotenv/config";
import { checkRateLimit } from "@/backend/server/rate-limit/rateLimit";
import {
  OutreachSubmission,
  GeneratedOutreach,
} from "@/backend/types/outreach";
import {
  formatOutreachSubmissionForGemini,
  FormattedOutreachSubmission,
  outreachFormSchema,
} from "@/backend/constants/outreach";

// subject is only returned for emails; "Detailed" emails can run long
const GeminiGeneratedOutReachSchema = z.object({
  subject: z.string().max(200, "Subject is too long.").optional(),
  response: z
    .string()
    .min(10, "Response is too short.")
    .max(4000, "Outreach is too long."),
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
  submission: OutreachSubmissionInput,
): Promise<OutreachGeminiResult> {
  console.log("SERVER GENERATE OUTREACH STARTED");

  // verify user
  const user = await ensureUser();
  console.log("ENSURE USER DONE");

  const userId = user.id;
  if (!userId) {
    return {
      success: false,
      error: "You must be signed in to generate outreach",
    };
  }

  // verify submission with the same schema the form uses
  const validatedSubmission = outreachFormSchema.safeParse(submission);
  if (!validatedSubmission.success) {
    return {
      success: false,
      error: "Missing or invalid outreach submission",
    };
  }
  const outreachSubmission: OutreachSubmissionInput = validatedSubmission.data;

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
    const formattedUserSubmission =
      formatOutreachSubmissionForGemini(outreachSubmission);

    const geminiRawResponse = await sendSubmissionToGemini(
      formattedUserSubmission,
    );

    const parsedGeminiResponse =
      await parseGeminiRawResponse(geminiRawResponse);

    const savedOutreachGeneration = await saveGeneratedOutreach(
      userId,
      outreachSubmission,
      parsedGeminiResponse,
    );

    return {
      success: true,
      data: savedOutreachGeneration,
      remaining: rateLimit.remaining,
    };
  } catch (err) {
    console.error("Failed to generate outreach: ", err);
    return {
      success: false,
      error: "Something went wrong while generating your outreach",
    };
  }
}

async function sendSubmissionToGemini(
  submission: FormattedOutreachSubmission,
): Promise<string> {
  console.log("OUTREACH GENERATION HIT");

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
You are an expert outreach and startup messaging strategist.

Your task is to generate exactly 1 polished outreach message based on the user's submission.

The user submission includes the following fields:
- sender: who is writing, in their own words (name, role, company, relevant background)
- recipient: who they are writing to, in their own words (name, role, company, anything relevant)
- reason: why they are reaching out to this person specifically, including any relationship or shared context
- ask: what the sender wants the recipient to do
  Possible values: Book a call, Get advice, Get feedback, An introduction, Get a reply, Other
- method: the format of the outreach
  Possible values: Email, Message (a LinkedIn or text message)
- tone: the desired tone. Possible values: Professional, Friendly, Casual, Direct
- length: the desired length. Possible values: Short, Medium, Detailed

How to read the submission:
- Pull the sender's and recipient's names, roles and companies out of their descriptions. Use only what is written.
- Infer the relationship from the reason. If the reason mentions meeting before, a referral or a past conversation, reflect it. Otherwise treat it as cold outreach.
- If ask is "Other", base the ask on the reason.

Rules for missing information:
- Do not write placeholders like "[Recipient Name]", "[Company]", or "[Your Name]".
- If the recipient's name isn't given, use a natural greeting such as "Hi," for email, or omit the greeting for messages.
- Do not invent a company, role, title, mutual connection or any other fact that isn't in the submission.

Writing rules:
- Make the message sound human, natural, and specific.
- Do not be overly salesy.
- Do not use vague buzzwords like "revolutionary", "cutting-edge", "game-changing", or "innovative".
- Do not over-explain.
- If method is "Message", make it shorter, more conversational, and avoid email-style formatting.
- If method is "Email", include a subject line and a properly formatted email body, signed with the sender's name.
- Match the selected tone and length.
- The ask should be clear and low-friction.

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

If method is "Message", return this exact JSON shape:

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
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  return response.text;
}

async function parseGeminiRawResponse(
  rawResponse: string,
): Promise<GeneratedOutreach> {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawResponse);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  const validationResult = GeminiGeneratedOutReachSchema.safeParse(parsedJson);

  if (!validationResult.success) {
    console.error(
      "Gemini response failed validation: ",
      validationResult.error,
    );
    throw new Error("Gemini response did not match the expected format.");
  }

  const { subject, response } = validationResult.data;

  return {
    id: "1",
    ...(subject ? { subject } : {}),
    response,
  };
}

async function saveGeneratedOutreach(
  userId: string,
  outreachSubmission: OutreachSubmissionInput,
  parsedGeminiResponse: GeneratedOutreach,
): Promise<GeneratedOutreach> {
  console.log("Saving outreach in prisma");

  const interaction = {
    response: parsedGeminiResponse,

    submission: {
      create: {
        sender: outreachSubmission.sender,
        recipient: outreachSubmission.recipient,
        reason: outreachSubmission.reason,

        ask: outreachSubmission.ask,
        method: outreachSubmission.method,
        tone: outreachSubmission.tone,
        length: outreachSubmission.length,
      },
    },
  };

  // either add to the user's existing outreach history or create it
  await prisma.outreachHistory.upsert({
    where: {
      userId,
    },
    update: {
      interactions: {
        create: interaction,
      },
    },
    create: {
      userId,
      interactions: {
        create: interaction,
      },
    },
  });

  return parsedGeminiResponse;
}
