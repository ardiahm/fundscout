/**
 * Creates a Stripe Checkout Session for a paid FundScout plan and returns its URL.
 *
 * Expects: POST { plan: "founder" | "emperor", interval: "month" | "year" }
 *
 * Required env vars:
 * STRIPE_SECRET_KEY
 * STRIPE_PRICE_FOUNDER_MONTHLY, STRIPE_PRICE_FOUNDER_YEARLY
 * STRIPE_PRICE_EMPEROR_MONTHLY, STRIPE_PRICE_EMPEROR_YEARLY
 */

import { NextResponse } from "next/server";
import { ensureUser } from "@/app/lib/auth/ensureUser";

const PRICE_ENV_KEYS = {
  founder: {
    month: "STRIPE_PRICE_FOUNDER_MONTHLY",
    year: "STRIPE_PRICE_FOUNDER_YEARLY",
  },
  emperor: {
    month: "STRIPE_PRICE_EMPEROR_MONTHLY",
    year: "STRIPE_PRICE_EMPEROR_YEARLY",
  },
} as const;

type PaidPlan = keyof typeof PRICE_ENV_KEYS;
type BillingInterval = "month" | "year";

function isPaidPlan(value: unknown): value is PaidPlan {
  return typeof value === "string" && value in PRICE_ENV_KEYS;
}

function isBillingInterval(value: unknown): value is BillingInterval {
  return value === "month" || value === "year";
}

export async function POST(req: Request) {
  // verify user
  const user = await ensureUser();

  const body = await req.json().catch(() => null);
  const plan = body?.plan;
  const interval = body?.interval;

  if (!isPaidPlan(plan) || !isBillingInterval(interval)) {
    return NextResponse.json(
      { error: "Choose a paid plan and a billing interval." },
      { status: 400 },
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env[PRICE_ENV_KEYS[plan][interval]];

  // if stripe isn't configured, tell the client instead of failing silently
  if (!secretKey || !priceId) {
    return NextResponse.json(
      {
        error:
          "Checkout isn't connected yet. Add your Stripe keys to .env to turn on upgrades.",
      },
      { status: 503 },
    );
  }

  const origin = new URL(req.url).origin;

  // stripe's REST API expects form-encoded params
  const params = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    client_reference_id: user.id,
    "metadata[plan]": plan,
    "metadata[interval]": interval,
    "metadata[clerkUserId]": user.clerkUserId,
  });

  const stripeResponse = await fetch(
    "https://api.stripe.com/v1/checkout/sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    },
  );

  const session = await stripeResponse.json();

  if (!stripeResponse.ok || !session.url) {
    console.error("Stripe checkout failed: ", session?.error?.message);
    return NextResponse.json(
      { error: "Stripe couldn't start checkout. Try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: session.url });
}
