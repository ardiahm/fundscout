"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { ensureUser } from "@/app/lib/auth/ensureUser";

export async function deleteOutreachInteraction(interactionId: string) {
  // verify user, and only delete interactions in their own history
  const user = await ensureUser();

  await prisma.outreachInteraction.deleteMany({
    where: {
      id: interactionId,
      history: { userId: user.id },
    },
  });

  revalidatePath("/outreach");
}
