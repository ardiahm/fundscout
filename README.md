# FundScout

FundScout is a full-stack platform built using Next.js, Prisma (ORM built off PostgreSQL), Docker, and Clerk.

## Inspiration

Through my early years of undergrad, I've become more and more involved in entrepreneurship. I started this project as a SaaS venture, and realized over time that this project, for lack of better words, would not be _the one_.

## Picture Gallery
![]()

## Understanding Backend

First, begin by starting the Docker container (which exposes port 5432). The container contains an image of Postgres 16.

Look at commit history, which contains the scripts necessary to seed/populate the database in ~/backend/scripts/*.ts

In ~/docker-compose.yml, you can modify which port is being exposed. If you do this, you must also modify which port is being listened to in .ENV

To verify the Docker container is running:

```bash
docker ps
```

## Running Development Server

Run the development server using:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to load FundScout.

## Features of FundScout

When it comes to Investor/Investment Data, FundScout allows users to:

1. Browse through an Invest Index, which contains data surrounding investors and their investments:
    1. Company invested in.
    2. Amount of investment.
    3. Date of investment.
    4. Company sectors (industries)
2. Favorite and Unfavorite investors, and filter by favorites by visiting /favorites
3. Search for investors present in the Invest Index

FundScout also helps generate pitch collateral, reducing the time it takes for users to go from ideation to active fundraising. FundScout specifically helps users:

1. Generate One-Liners, to accurately and impactfully describe their product/business. This requires users filling out a form answering:
    1. Who are you targeting? (Businesses, Consumers, Both)
    2. What industry are you building in?
    3. What's the name of your product/company?
    4. In simple terms, what does your solution do?
    5. Who is your ideal user?
    6. What problem does your solution solve?
    7. What is the biggest outcome from using your solution?
    8. What makes it better, faster, cheaper, easier, or more unique than existing options?

2. Generate Outreach, to assist in any attempt at communication between user and desired recipient. This requires users filling out a form answering:
    1. Sender Name
    2. Sender Role (optional)
    3. Sender Company (optional)
    4. Sender Background (optional)
    5. Recipient Name
    6. Recipient Role (optional)
    7. Recipient Company (optional)
    8. Recipient Industry (optional)
    9. Relationship Context (i.e. cold outreach, met before, referred by someone, existing customer, etc. )
    10. Reason for Reaching Out
    11. Call To Action (i.e. schedule a call, reply with interest, give feedback, make an introduction, etc. )
    12. Desired message length (Short, Medium, Detailed)

## Middleware

All authentication within FundScout is powered by _Clerk_. This ensures:

Users visiting a webpage are logged in and all /onboarding fields have been filled during their account creation.

In the case there are empty fields (i.e. a developer added more questions), users will be re-routed to update their /onboarding answers

## Server Actions

### Rate Limiting

All rate limiting is handled via a RateLimit model in the database schema. All functions for rate limiting can be found in ~/backend/server/rate-limit/rateLimit.ts

The function, checkRateLimit, requires:

1. Key (userId from Clerk)
2. Action (what service is the user trying to use)
3. Limit (how many more times can user use this service)
4. windowMs (how many Ms until limit resets)
    1. windowMs within OneLiner Generation = 24 * 60 * 60 * 1000 = 1 day
    2. windowMs within Outreach Generation = 24 * 60 * 60 * 1000 = 1 day

_Return Object_:
allowed: boolean
remaining: int
resetAt: DateTime

The RateLimit model searches for an existing rateLimit for the provided Key and Action:

1. If it doesn't exist, or rate limit is due for a reset (windowMs), model upserts in Prisma.
2. If it does exist, but limit has been reached:
    1. _Return Object_.allowed = false
    2. _Return Object_.remaining = 0
    3. _Return Object_.resetAt: _unchanged_
3. If it does exist, and limit hasn't been reached, incremement count, and return:
    1. _Return Object_.allowed = true
    2. _Return Object_.remaining = limit - count
    3. _Return Object_.resetAt: _unchanged_

