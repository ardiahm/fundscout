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
    OutreachInteraction,
    OutreachHistory
} from "@/backend/types/outreach";

export const outreachGoalLabels: Record<OutreachGoal, string> = {
  [OutreachGoal.BOOK_A_MEETING]: "Book a meeting",
  [OutreachGoal.ASK_FOR_ADVICE]: "Ask for advice",
  [OutreachGoal.PITCH_PRODUCT_SERVICE]: "Pitch a product/service",
  [OutreachGoal.FOLLOW_UP]: "Follow up",
  [OutreachGoal.NETWORK]: "Network",
  [OutreachGoal.RECRUITING_JOB_OPPORTUNITY]: "Recruiting/job opportunity",
  [OutreachGoal.PARTNERSHIP]: "Partnership",
  [OutreachGoal.OTHER]: "Other",
};

export const outreachMethodLabels: Record<OutreachMethod, string> = {
  [OutreachMethod.EMAIL]: "Email",
  [OutreachMethod.MESSAGE_LINKEDIN_MOBILE]: "Message (LinkedIn or Mobile)",
};

export const outreachRelationshipLabels: Record<OutreachRelationship, string> = {
  [OutreachRelationship.COLD_OUTREACH]: "Cold outreach",
  [OutreachRelationship.MET_BEFORE]: "Met before",
  [OutreachRelationship.REFERRED_BY_SOMEONE]: "Referred by someone",
  [OutreachRelationship.EXISTING_CUSTOMER_CLIENT]: "Existing customer/client",
  [OutreachRelationship.PAST_CONVERSATION]: "Past conversation",
  [OutreachRelationship.FRIEND_ACQUAINTANCE]: "Friend/acquaintance",
};

export const outreachCallToActionLabels: Record<OutreachCallToAction, string> = {
  [OutreachCallToAction.SCHEDULE_A_CALL]: "Schedule a call",
  [OutreachCallToAction.REPLY_WITH_INTEREST]: "Reply with interest",
  [OutreachCallToAction.GIVE_FEEDBACK]: "Give feedback",
  [OutreachCallToAction.TRY_THE_PRODUCT]: "Try the product",
  [OutreachCallToAction.MAKE_AN_INTRODUCTION]: "Make an introduction",
  [OutreachCallToAction.ANSWER_A_QUESTION]: "Answer a question",
  [OutreachCallToAction.OTHER]: "Other",
};

export const outreachToneLabels: Record<OutreachTone, string> = {
  [OutreachTone.PROFESSIONAL]: "Professional",
  [OutreachTone.CASUAL]: "Casual",
  [OutreachTone.FRIENDLY]: "Friendly",
  [OutreachTone.CONFIDENT]: "Confident",
  [OutreachTone.WARM]: "Warm",
  [OutreachTone.DIRECT]: "Direct",
};

export const outreachLengthLabels: Record<OutreachLength, string> = {
  [OutreachLength.SHORT]: "Short",
  [OutreachLength.MEDIUM]: "Medium",
  [OutreachLength.DETAILED]: "Detailed",
};

export function formatOutreachSubmissionForGemini(
  submission: OutreachSubmission,
) {
  return {
    ...submission,
    goal: outreachGoalLabels[submission.goal],
    method: outreachMethodLabels[submission.method],
    relationship: outreachRelationshipLabels[submission.relationship],
    call_to_action: outreachCallToActionLabels[submission.call_to_action],
    tone: outreachToneLabels[submission.tone],
    length: outreachLengthLabels[submission.length],
  };
}