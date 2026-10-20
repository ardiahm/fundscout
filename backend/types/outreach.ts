import {
  OutreachAsk,
  OutreachMethod,
  OutreachTone,
  OutreachLength,
} from "@/backend/lib/generated/prisma/enums";

export type OutreachSubmission = {
  id: string;

  // free text, so one form works for any kind of recipient
  sender: string;
  recipient: string;
  reason: string;

  ask: OutreachAsk;
  method: OutreachMethod;
  tone: OutreachTone;
  length: OutreachLength;
};

export type GeneratedOutreach = {
  id: string;
  // only present when the method is email
  subject?: string;
  response: string;
};

export type OutreachInteraction = {
  id: string;
  submission: OutreachSubmission | null;
  response: GeneratedOutreach;
  createdAt: Date;
};

export type OutreachHistory = {
  interactions: OutreachInteraction[];
};
