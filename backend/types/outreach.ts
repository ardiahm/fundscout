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
  goal:
    | "Book a meeting"
    | "Ask for advice"
    | "Pitch a product/service"
    | "Follow up"
    | "Network"
    | "Recruiting/job opportunity"
    | "Partnership"
    | "Other";

  form: "Email" | "Message (LinkedIn or Mobile)";

  relationship:
    | "Cold outreach"
    | "Met before"
    | "Referred by someone"
    | "Existing customer/client"
    | "Past conversation"
    | "Friend/acquaintance";

  connection_context?: string;

  // Message context
  reason_for_reaching_out: string;
  personalization?: string;
  value_proposition?: string;

  // Ask
  call_to_action:
    | "Schedule a call"
    | "Reply with interest"
    | "Give feedback"
    | "Try the product"
    | "Make an introduction"
    | "Answer a question"
    | "Other";

  cta_details?: string;

  // Style
  tone: "Professional" | "Casual" | "Friendly" | "Confident" | "Warm" | "Direct";
  length: "Short" | "Medium" | "Detailed";
};

export type GeneratedOutreach = {
    id: number;
    response: string;
}

export type OutreachInteraction = {
    id: string;
    submission: OutreachSubmission | null;
    response: GeneratedOutreach;
    createdAt: Date;
}

export type OutreachHistory = {
    interactions: OutreachInteraction[];
} 