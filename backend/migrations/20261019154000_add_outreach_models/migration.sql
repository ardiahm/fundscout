-- CreateEnum
CREATE TYPE "OutreachGoal" AS ENUM ('BOOK_A_MEETING', 'ASK_FOR_ADVICE', 'PITCH_PRODUCT_SERVICE', 'FOLLOW_UP', 'NETWORK', 'RECRUITING_JOB_OPPORTUNITY', 'PARTNERSHIP', 'OTHER');

-- CreateEnum
CREATE TYPE "OutreachMethod" AS ENUM ('EMAIL', 'MESSAGE_LINKEDIN_MOBILE');

-- CreateEnum
CREATE TYPE "OutreachRelationship" AS ENUM ('COLD_OUTREACH', 'MET_BEFORE', 'REFERRED_BY_SOMEONE', 'EXISTING_CUSTOMER_CLIENT', 'PAST_CONVERSATION', 'FRIEND_ACQUAINTANCE');

-- CreateEnum
CREATE TYPE "OutreachCallToAction" AS ENUM ('SCHEDULE_A_CALL', 'REPLY_WITH_INTEREST', 'GIVE_FEEDBACK', 'TRY_THE_PRODUCT', 'MAKE_AN_INTRODUCTION', 'ANSWER_A_QUESTION', 'OTHER');

-- CreateEnum
CREATE TYPE "OutreachTone" AS ENUM ('PROFESSIONAL', 'CASUAL', 'FRIENDLY', 'CONFIDENT', 'WARM', 'DIRECT');

-- CreateEnum
CREATE TYPE "OutreachLength" AS ENUM ('SHORT', 'MEDIUM', 'DETAILED');

-- CreateTable
CREATE TABLE "OutreachHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachInteraction" (
    "id" TEXT NOT NULL,
    "historyId" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutreachInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachSubmission" (
    "id" TEXT NOT NULL,
    "interactionId" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "sender_role" TEXT,
    "sender_company" TEXT,
    "sender_background" TEXT,
    "recipient_name" TEXT,
    "recipient_role" TEXT,
    "recipient_company" TEXT,
    "recipient_industry" TEXT,
    "goal" "OutreachGoal" NOT NULL,
    "method" "OutreachMethod" NOT NULL,
    "relationship" "OutreachRelationship" NOT NULL,
    "relationship_context" TEXT,
    "reason_for_reaching_out" TEXT NOT NULL,
    "call_to_action" "OutreachCallToAction" NOT NULL,
    "call_to_action_details" TEXT,
    "tone" "OutreachTone" NOT NULL,
    "length" "OutreachLength" NOT NULL,

    CONSTRAINT "OutreachSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OutreachHistory_userId_key" ON "OutreachHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OutreachSubmission_interactionId_key" ON "OutreachSubmission"("interactionId");

-- AddForeignKey
ALTER TABLE "OutreachHistory" ADD CONSTRAINT "OutreachHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachInteraction" ADD CONSTRAINT "OutreachInteraction_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "OutreachHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachSubmission" ADD CONSTRAINT "OutreachSubmission_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "OutreachInteraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
