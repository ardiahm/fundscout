import {
  OutreachGoal,
  OutreachMethod,
  OutreachRelationship,
  OutreachCallToAction,
  OutreachTone,
  OutreachLength,
} from "@/backend/lib/generated/prisma/client";

export type OutreachSubmission = {
  id: string;

  // Sender
  sender_name: string;
  sender_role?: string;
  sender_company?: string;
  sender_background?: string;

  // Recipient
  recipient_name?: string;
  recipient_role?: string;
  recipient_company?: string;
  recipient_industry?: string;

  // Outreach details
  goal: OutreachGoal;

  method: OutreachMethod;

  relationship: OutreachRelationship;

  relationship_context?: string;

  // Message context
  reason_for_reaching_out: string;

  // Ask
  call_to_action: OutreachCallToAction;

  call_to_action_details?: string;

  // Style
  tone: OutreachTone;
  length: OutreachLength;
};

export type GeneratedOutreach = {
  id: string;
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
