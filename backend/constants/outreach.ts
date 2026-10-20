import {
  OutreachAsk,
  OutreachMethod,
  OutreachTone,
  OutreachLength,
} from "@/backend/lib/generated/prisma/enums";

import type { OutreachSubmission } from "@/backend/types/outreach";
import * as z from "zod";

export const outreachAskLabels: Record<OutreachAsk, string> = {
  [OutreachAsk.BOOK_A_CALL]: "Book a call",
  [OutreachAsk.GET_ADVICE]: "Get advice",
  [OutreachAsk.GET_FEEDBACK]: "Get feedback",
  [OutreachAsk.AN_INTRODUCTION]: "An introduction",
  [OutreachAsk.GET_A_REPLY]: "Get a reply",
  [OutreachAsk.OTHER]: "Other",
};

export const outreachMethodLabels: Record<OutreachMethod, string> = {
  [OutreachMethod.EMAIL]: "Email",
  [OutreachMethod.MESSAGE_LINKEDIN_MOBILE]: "Message",
};

export const outreachToneLabels: Record<OutreachTone, string> = {
  [OutreachTone.PROFESSIONAL]: "Professional",
  [OutreachTone.FRIENDLY]: "Friendly",
  [OutreachTone.CASUAL]: "Casual",
  [OutreachTone.DIRECT]: "Direct",
};

export const outreachLengthLabels: Record<OutreachLength, string> = {
  [OutreachLength.SHORT]: "Short",
  [OutreachLength.MEDIUM]: "Medium",
  [OutreachLength.DETAILED]: "Detailed",
};

// shared by the outreach form (client) and generateOutreach (server)
export const outreachFormSchema = z.object({
  sender: z
    .string()
    .trim()
    .min(2, "Tell us at least your name.")
    .max(300, "Who you are cannot be more than 300 characters."),
  recipient: z
    .string()
    .trim()
    .min(2, "Tell us who you're writing to.")
    .max(300, "Who you're writing to cannot be more than 300 characters."),
  reason: z
    .string()
    .trim()
    .min(10, "Please give at least 10 characters of context.")
    .max(1000, "Why you're reaching out cannot be more than 1000 characters."),

  ask: z.enum(OutreachAsk, { message: "Please select what you want from them." }),
  method: z.enum(OutreachMethod, { message: "Please select a format." }),
  tone: z.enum(OutreachTone, { message: "Please select a tone." }),
  length: z.enum(OutreachLength, { message: "Please select a length." }),
});

export type OutreachFormValues = z.infer<typeof outreachFormSchema>;

export type FormattedOutreachSubmission = Omit<
  OutreachSubmission,
  "id" | "ask" | "method" | "tone" | "length"
> & {
  ask: string;
  method: string;
  tone: string;
  length: string;
};

// swap enum values for readable labels before sending to Gemini
export function formatOutreachSubmissionForGemini(
  submission: Omit<OutreachSubmission, "id">,
): FormattedOutreachSubmission {
  return {
    sender: submission.sender.trim(),
    recipient: submission.recipient.trim(),
    reason: submission.reason.trim(),

    ask: outreachAskLabels[submission.ask],
    method: outreachMethodLabels[submission.method],
    tone: outreachToneLabels[submission.tone],
    length: outreachLengthLabels[submission.length],
  };
}
