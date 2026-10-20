-- CreateEnum
CREATE TYPE "OutreachAsk" AS ENUM ('BOOK_A_CALL', 'GET_ADVICE', 'GET_FEEDBACK', 'AN_INTRODUCTION', 'GET_A_REPLY', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "OutreachTone_new" AS ENUM ('PROFESSIONAL', 'FRIENDLY', 'CASUAL', 'DIRECT');
ALTER TABLE "OutreachSubmission" ALTER COLUMN "tone" TYPE "OutreachTone_new" USING ("tone"::text::"OutreachTone_new");
ALTER TYPE "OutreachTone" RENAME TO "OutreachTone_old";
ALTER TYPE "OutreachTone_new" RENAME TO "OutreachTone";
DROP TYPE "public"."OutreachTone_old";
COMMIT;

-- AlterTable
ALTER TABLE "OutreachSubmission" DROP COLUMN "call_to_action",
DROP COLUMN "call_to_action_details",
DROP COLUMN "goal",
DROP COLUMN "reason_for_reaching_out",
DROP COLUMN "recipient_company",
DROP COLUMN "recipient_industry",
DROP COLUMN "recipient_name",
DROP COLUMN "recipient_role",
DROP COLUMN "relationship",
DROP COLUMN "relationship_context",
DROP COLUMN "sender_background",
DROP COLUMN "sender_company",
DROP COLUMN "sender_name",
DROP COLUMN "sender_role",
ADD COLUMN     "ask" "OutreachAsk" NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL,
ADD COLUMN     "recipient" TEXT NOT NULL,
ADD COLUMN     "sender" TEXT NOT NULL;

-- DropEnum
DROP TYPE "OutreachCallToAction";

-- DropEnum
DROP TYPE "OutreachGoal";

-- DropEnum
DROP TYPE "OutreachRelationship";

