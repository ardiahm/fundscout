"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import type { ProjectStage } from "@/backend/lib/generated/prisma/client";
import {
  PLANS,
  STAGES,
  recommendedPlanFor,
  type BillingInterval,
  type PlanId,
  type PricingPlan,
} from "./plans";

type Props = {
  currentPlan: PlanId;
  stage: ProjectStage | null;
};

// accent per plan, reused by the stage track and the cards
const PLAN_ACCENT: Record<PlanId, { bar: string; text: string }> = {
  scout: { bar: "bg-sky-300", text: "text-sky-700" },
  founder: { bar: "bg-blue-600", text: "text-blue-700" },
  emperor: { bar: "bg-emerald-500", text: "text-emerald-700" },
};

const FAQS = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Cancel from your billing page and you keep your plan until the end of the period you paid for. You won't be charged again.",
  },
  {
    question: "What happens to my one-liners and outreach if I downgrade?",
    answer:
      "Everything you've generated stays in your history. Only the daily generation limits change.",
  },
  {
    question: "Who handles my payment details?",
    answer:
      "Stripe processes every payment. FundScout never sees or stores your card number.",
  },
  {
    question: "What does “Soon” mean on a feature?",
    answer:
      "It's on the roadmap but not live yet. Paid plans get each one as soon as it ships, at no extra cost.",
  },
];

export default function PricingPageClient({ currentPlan, stage }: Props) {
  const [interval, setBillingInterval] = useState<BillingInterval>("month");
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
  const searchParams = useSearchParams();

  const recommended = recommendedPlanFor(stage);

  // returning from a cancelled stripe checkout
  useEffect(() => {
    if (searchParams.get("checkout") === "cancelled") {
      toast("Checkout cancelled. You haven't been charged.");
    }
  }, [searchParams]);

  const startCheckout = async (planId: PlanId) => {
    setPendingPlan(planId);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, interval }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Couldn't open checkout. Try again.");
        setPendingPlan(null);
        return;
      }

      window.location.assign(data.url);
    } catch (err) {
      console.error("Checkout request failed: ", err);
      toast.error("Couldn't reach checkout. Check your connection and try again.");
      setPendingPlan(null);
    }
  };

  return (
    <div className="mx-4 sm:mx-10 lg:mx-auto lg:max-w-6xl lg:px-10">
      {/* ================= Header ================= */}
      <header className="flex flex-col gap-6 pt-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Plans that grow with your raise
          </h1>
          <p className="pt-3 text-lg text-gray-600">
            Start free while you shape the idea. Upgrade when it&apos;s time to
            pitch.
          </p>
        </div>

        <BillingToggle interval={interval} onChange={setBillingInterval} />
      </header>

      {/* ================= Stage Track ================= */}
      <StageTrack stage={stage} />

      {/* ================= Plans ================= */}
      <section className="grid grid-cols-1 gap-5 pt-10 lg:grid-cols-3 lg:items-start">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            interval={interval}
            isCurrent={plan.id === currentPlan}
            isRecommended={plan.id === recommended}
            hasStage={stage !== null}
            isPending={pendingPlan === plan.id}
            isDisabled={pendingPlan !== null}
            onUpgrade={() => startCheckout(plan.id)}
          />
        ))}
      </section>

      {/* ================= FAQ ================= */}
      <section className="mx-auto max-w-3xl pt-20">
        <h2 className="text-2xl font-semibold">Questions</h2>
        <div className="pt-4">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group border-b border-gray-200 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-lg font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
                {faq.question}
                <span
                  aria-hidden
                  className="text-2xl font-light text-gray-400 transition-transform group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="max-w-prose pt-3 text-gray-600 group-open:animate-in group-open:fade-in group-open:slide-in-from-top-1 group-open:duration-300 motion-reduce:animate-none">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- Billing toggle ---------- */

function BillingToggle({
  interval,
  onChange,
}: {
  interval: BillingInterval;
  onChange: (interval: BillingInterval) => void;
}) {
  const options: { value: BillingInterval; label: string }[] = [
    { value: "month", label: "Monthly" },
    { value: "year", label: "Yearly" },
  ];

  return (
    <div className="flex flex-col items-start gap-2 md:items-end">
      <div
        role="radiogroup"
        aria-label="Billing interval"
        className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={interval === option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              interval === option.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-emerald-700">
        Pay yearly and get 2 months free
      </p>
    </div>
  );
}

/* ---------- Stage track ---------- */

function StageTrack({ stage }: { stage: ProjectStage | null }) {
  const stageIndex = STAGES.findIndex((s) => s.key === stage);
  const currentPlanId = PLANS.find((p) => stage && p.stages.includes(stage))?.id;
  const columns = STAGES.map((s) => s.width).join(" ");

  // grid column where a plan's span starts (plans cover consecutive stages)
  const startColumn = (plan: PricingPlan) =>
    STAGES.findIndex((s) => s.key === plan.stages[0]) + 1;

  return (
    <section
      aria-label="Which plan fits each stage"
      className="mt-10 rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-6 sm:px-8"
    >
      <p className="pb-5 text-sm text-gray-600">
        {stage
          ? "Based on the stage you picked during onboarding:"
          : "Each plan is built for a stage of your startup:"}
      </p>

      <div
        className="grid gap-x-3"
        style={{ gridTemplateColumns: columns }}
      >
        {/* row 1: stages */}
        {STAGES.map((s, index) => (
          <span
            key={s.key}
            style={{ gridRow: 1, gridColumn: index + 1 }}
            className={`text-xs leading-tight sm:text-sm ${
              index === stageIndex
                ? "font-semibold text-gray-900"
                : "text-gray-500"
            }`}
          >
            {s.label}
          </span>
        ))}

        {/* row 2: one bar per plan, spanning the stages it covers */}
        {PLANS.map((plan) => (
          <span
            key={plan.id}
            style={{
              gridRow: 2,
              gridColumn: `${startColumn(plan)} / span ${plan.stages.length}`,
            }}
            className={`mt-2 h-2 rounded-full ${PLAN_ACCENT[plan.id].bar} ${
              currentPlanId && plan.id !== currentPlanId ? "opacity-40" : ""
            }`}
          />
        ))}

        {/* row 3: marker under the user's stage */}
        {stageIndex !== -1 && (
          <span
            style={{ gridRow: 3, gridColumn: stageIndex + 1 }}
            className="pt-2 text-xs font-medium text-blue-700 sm:text-sm"
          >
            You&apos;re here
          </span>
        )}

        {/* row 4: plan names */}
        {PLANS.map((plan) => (
          <span
            key={plan.id}
            style={{
              gridRow: 4,
              gridColumn: `${startColumn(plan)} / span ${plan.stages.length}`,
            }}
            className={`pt-3 text-sm font-semibold sm:text-base ${PLAN_ACCENT[plan.id].text}`}
          >
            {plan.name}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------- Plan card ---------- */

type PlanCardProps = {
  plan: PricingPlan;
  interval: BillingInterval;
  isCurrent: boolean;
  isRecommended: boolean;
  hasStage: boolean;
  isPending: boolean;
  isDisabled: boolean;
  onUpgrade: () => void;
};

function PlanCard({
  plan,
  interval,
  isCurrent,
  isRecommended,
  hasStage,
  isPending,
  isDisabled,
  onUpgrade,
}: PlanCardProps) {
  const price = plan.price[interval];
  const isFree = price === 0;
  // list price for the selected interval, struck through next to the real price
  const listPrice = plan.listPrice
    ? interval === "month"
      ? plan.listPrice
      : plan.listPrice * 12
    : null;
  const savings = listPrice ? listPrice - price : 0;

  return (
    <Card
      className={`relative h-full ${
        isRecommended ? "border-blue-600 ring-2 ring-blue-600" : ""
      }`}
    >
      {isRecommended && (
        <span className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
          {hasStage ? "Recommended for your stage" : "Most popular"}
        </span>
      )}

      <CardHeader className="gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={`h-2.5 w-2.5 rounded-full ${PLAN_ACCENT[plan.id].bar}`}
          />
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
        </div>
        <CardDescription className="text-base lg:min-h-12">
          {plan.summary}
        </CardDescription>

        {/* Price */}
        <div className="pt-4">
          <div className="flex items-baseline gap-2">
            {listPrice && (
              <s className="text-2xl font-medium text-gray-400 tabular-nums">
                <span className="sr-only">Was </span>${listPrice}
              </s>
            )}
            <span className="text-5xl font-semibold tracking-tight tabular-nums">
              {listPrice && <span className="sr-only">now </span>}${price}
            </span>
            <span className="text-gray-500">
              {isFree ? "forever" : interval === "month" ? "/ month" : "/ year"}
            </span>
          </div>
          <p className="min-h-5 pt-1 text-sm text-emerald-700">
            {savings > 0 &&
              `Launch price: you save $${savings} a ${interval}`}
          </p>
        </div>
      </CardHeader>

      <CardFooter>
        {isCurrent ? (
          <Button variant="outline" size="lg" className="w-full" disabled>
            Your current plan
          </Button>
        ) : isFree ? (
          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link href="/dashboard">Search investors</Link>
          </Button>
        ) : (
          <Button
            size="lg"
            className={`w-full ${
              isRecommended
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
            disabled={isDisabled}
            onClick={onUpgrade}
          >
            {isPending ? "Opening checkout..." : `Upgrade to ${plan.name}`}
          </Button>
        )}
      </CardFooter>

      <CardContent className="border-t border-gray-100 pt-6">
        {plan.includesLabel && (
          <p className="pb-3 text-sm font-medium text-gray-900">
            {plan.includesLabel}
          </p>
        )}
        <ul className="space-y-3 text-sm">
          {plan.features.map((feature) => (
            <li key={feature.label} className="flex items-start gap-3">
              <Check
                aria-hidden
                className={`mt-0.5 h-4 w-4 shrink-0 ${PLAN_ACCENT[plan.id].text}`}
              />
              <span className="text-gray-700">
                {feature.label}
                {feature.soon && (
                  <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                    Soon
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
