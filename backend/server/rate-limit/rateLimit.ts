import { prisma } from "@/backend/lib/prisma";

type RateLimitOptions = {
  key: string;
  action: string;
  limit: number;
  windowMs: number;
};

export async function checkRateLimit({
  key,
  action,
  limit,
  windowMs,
}: RateLimitOptions) {
  const now = new Date();

  const resetAt = new Date(now.getTime() + windowMs);

  // find existing rateLimit for the defined key_action
  const existing = await prisma.rateLimit.findUnique({
    where: {
      key_action: {
        key,
        action,
      },
    },
  });

  // if not existing, or rate limit is due to reset, upsert
  if (!existing || existing.resetAt <= now) {
    await prisma.rateLimit.upsert({
      where: {
        key_action: {
          key,
          action,
        },
      },
      update: {
        count: 1,
        resetAt,
      },
      create: {
        key,
        action,
        count: 1,
        resetAt,
      },
    });

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt,
    };
  }

  // if limit has been reached, return allowed = false
  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  // update count 
  const updated = await prisma.rateLimit.update({
    where: {
      key_action: {
        key,
        action,
      },
    },
    data: {
      count: {
        increment: 1,
      },
    },
  });

  return {
    allowed: true,
    remaining: limit - updated.count,
    resetAt: existing.resetAt,
  };
}

// read-only check, for actions that should only count once they succeed
export async function getRateLimitStatus({
  key,
  action,
  limit,
}: Omit<RateLimitOptions, "windowMs">) {
  const existing = await prisma.rateLimit.findUnique({
    where: {
      key_action: {
        key,
        action,
      },
    },
  });

  if (!existing || existing.resetAt <= new Date()) {
    return { allowed: true, remaining: limit, resetAt: null };
  }

  return {
    allowed: existing.count < limit,
    remaining: Math.max(limit - existing.count, 0),
    resetAt: existing.resetAt,
  };
}
