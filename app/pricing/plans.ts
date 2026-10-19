import type { Plan, ProjectStage } from "@/backend/lib/generated/prisma/client";

export type PlanId = "scout" | "founder" | "emperor";
export type BillingInterval = "month" | "year";

export type PlanFeature = {
  label: string;
  soon?: boolean;
};

export type PricingPlan = {
  id: PlanId;
  name: string;
  summary: string;
  // which onboarding stages this plan is built for
  stages: ProjectStage[];
  price: Record<BillingInterval, number>;
  // pre-launch monthly price, shown struck through next to the current price
  listPrice?: number;
  includesLabel?: string;
  features: PlanFeature[];
};

// width is the stage's share of the stage track; validation is a short step
export const STAGES: { key: ProjectStage; label: string; width: string }[] = [
  { key: "IDEATION", label: "Ideation", width: "1fr" },
  { key: "MVP", label: "Building MVP", width: "1fr" },
  { key: "VALIDATION", label: "Validation", width: "0.7fr" },
  { key: "RAISING_FUNDS", label: "Raising funds", width: "1fr" },
];

export const PLANS: PricingPlan[] = [
  {
    id: "scout",
    name: "Scout",
    summary: "For exploring ideas and learning who invests in your space.",
    stages: ["IDEATION"],
    price: { month: 0, year: 0 },
    features: [
      { label: "Search the full Investor Index" },
      { label: "Investor profiles with every tracked investment" },
      { label: "Save favorite investors" },
      { label: "4 one-liner generations a day" },
      { label: "4 outreach drafts a day" },
    ],
  },
  {
    id: "founder",
    name: "Founder",
    summary: "For building your product and getting ready to pitch.",
    stages: ["MVP", "VALIDATION"],
    price: { month: 19, year: 190 },
    listPrice: 29,
    includesLabel: "Everything in Scout, plus",
    features: [
      { label: "Unlimited one-liners and outreach drafts" },
      { label: "Investor fit score for your startup", soon: true },
      { label: "Warm or cold intro indicator", soon: true },
      { label: "5 pitch deck generations a day", soon: true },
      { label: "Scout AI assistant, 10 questions a day", soon: true },
    ],
  },
  {
    id: "emperor",
    name: "Emperor",
    summary: "For founders in active fundraising mode.",
    stages: ["RAISING_FUNDS"],
    price: { month: 49, year: 490 },
    listPrice: 79,
    includesLabel: "Everything in Founder, plus",
    features: [
      { label: "Unlimited pitch decks and Scout AI", soon: true },
      { label: "Priority generation for faster drafts" },
      { label: "Auto-generated investor shortlists", soon: true },
      { label: "Fundraising progress tracking", soon: true },
      { label: "Early access to new FundScout tools" },
    ],
  },
];

// prisma Plan enum -> pricing plan id
export const PLAN_FROM_DB: Record<Plan, PlanId> = {
  FREE: "scout",
  PREMIUM: "founder",
  ULTIMATE: "emperor",
};

export function recommendedPlanFor(stage: ProjectStage | null): PlanId {
  if (!stage) return "founder";
  return PLANS.find((plan) => plan.stages.includes(stage))?.id ?? "founder";
}
