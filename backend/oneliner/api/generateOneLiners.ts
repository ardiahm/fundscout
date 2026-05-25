"use server";

import { GoogleGenAI } from "@google/genai";
import type {
  OneLinerSubmission,
  GeneratedOneLiner,
  OneLinerResponse,
} from "@/backend/types/oneliner";
import { ensureUser } from "@/app/lib/auth/ensureUser";
import { z } from "zod";
import { formSchema } from "@/app/components/site/oneliner-generator-card";
import { prisma } from "../../lib/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const GeminiOneLinerResponseSchema = z.object({
  generated_responses: z
    .array(
      z.object({
        response: z
          .string()
          .min(10, "One-liner is too short.")
          .max(250, "One-liner is too long."),
      }),
    )
    .length(3, "Gemini must return exactly 3 one-liners."),
});

type OneLinerSubmissionInput = Omit<OneLinerSubmission, "id">;

export default async function OneLinerGeminiCommunication(
  oneLinerSubmission: OneLinerSubmissionInput,
): Promise<GeneratedOneLiner[] | 0> {

  console.log("SERVER GENERATE ONE LINERS STARTED");

  // verify user
  const user = await ensureUser();
  console.log("ENSURE USER DONE");

  const userId = user.id;
  if (!userId) {
    return 0;
  }

  // verify submission
  if (!oneLinerSubmission) {
    return 0;
  }
  console.log("ONE LINER RECEIVED");

 
  // prompt gemini, send user submission, return JSON
  const geminiRawResponse = await sendSubmission(oneLinerSubmission);

  // validate and parse gemini JSON response from above by comparing with ResponseSchema from Zod
  // return [ {id = index, response = "...."}, {...}]
  const finalOneLiners =
    await parseAndValidateGeminiResponse(geminiRawResponse);

  // save one liners in prisma, either update or create user's interaction history
  const savedOneLiners = await saveGeneratedOneLiners(
    userId,
    oneLinerSubmission,
    finalOneLiners,
  );

  // return array of generated responses in proper format
  return savedOneLiners;
}

async function sendSubmission(
  submission: OneLinerSubmissionInput,
): Promise<string> {


  console.log("GEMINI KEY AT SERVER: ", process.env.GEMINI_API_KEY ? "FOUND" : "MISSING");
  console.log("GEMINI KEY VALUE: ", process.env.GEMINI_API_KEY);


  const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});


  const prompt = `
You are an expert startup messaging strategist.

Your task is to generate exactly 3 polished, distinct one-liners for a product or startup.

The user submission includes IN THIS ORDER:
- target: whether the product targets "Businesses", "Consumers", or "Both"
- industry: the industry the product is targeting
- name: the name of the product
- explanation: in simple terms, what the product does
- user: the ideal user or customer
- problem: the key problem the product solves
- result: the biggest result or outcome users get from the product
- unique: what makes the product better, faster, cheaper, easier, or more unique than existing options

Use all of this information to create one-liners that:
- Are concise and clear
- Accurately describe the product
- Speak to the intended target audience
- Communicate the main value proposition
- Avoid vague or overused words like "revolutionary", "cutting-edge", "game-changing", or "innovative"
- Sound natural, not robotic
- Do not invent facts that were not provided in the submission

Generate 3 different one-liners. They should vary slightly in phrasing and emphasis while staying faithful to the submission.

User submission:
${JSON.stringify(submission, null, 2)}

Return ONLY valid JSON in this exact shape:

{
  "generated_responses": [
    {
      "response": "First one-liner here"
    },
    {
      "response": "Second one-liner here"
    },
    {
      "response": "Third one-liner here"
    }
  ]
}
`;

  // return response
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response.");
  }

  console.log(response.text);

  return response.text;
}

async function parseAndValidateGeminiResponse(
  rawResponse: string,
): Promise<OneLinerResponse> {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawResponse);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  const validationResult = GeminiOneLinerResponseSchema.safeParse(parsedJson);

  if (!validationResult.success) {
    console.error(
      "Gemini response failed validation: ",
      validationResult.error,
    );
    throw new Error("Gemini response did not match the expected format.");
  }

  const validatedResponses = validationResult.data.generated_responses;

  console.log(
    validatedResponses.map((item, index) => ({
      id: index,
      response: item.response,
    })),
  );

  return {
    generated_responses: validatedResponses.map((item, index) => ({
      id: index,
      response: item.response,
    })),
  };
}

async function saveGeneratedOneLiners(
  userId: string,
  oneLinerSubmission: OneLinerSubmissionInput,
  finalOneLiners: OneLinerResponse,
): Promise<GeneratedOneLiner[]> {
  console.log("saving in prisma");

  await prisma.oneLinerHistory.upsert({
    where: {
      userId,
    },

    update: {
      interactions: {
        create: {
          response: finalOneLiners,

          submission: {
            create: {
              target: oneLinerSubmission.target,
              industry: oneLinerSubmission.industry,
              name: oneLinerSubmission.name,
              explanation: oneLinerSubmission.explanation,
              user: oneLinerSubmission.user,
              problem: oneLinerSubmission.problem,
              result: oneLinerSubmission.result,
              unique: oneLinerSubmission.unique,
            },
          },
        },
      },
    },
    create: {
      userId,
      interactions: {
        create: {
          response: finalOneLiners,

          submission: {
            create: {
              target: oneLinerSubmission.target,
              industry: oneLinerSubmission.industry,
              name: oneLinerSubmission.name,
              explanation: oneLinerSubmission.explanation,
              user: oneLinerSubmission.user,
              problem: oneLinerSubmission.problem,
              result: oneLinerSubmission.result,
              unique: oneLinerSubmission.unique,
            },
          },
        },
      },
    },
  });

  return finalOneLiners.generated_responses;
}
