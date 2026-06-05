"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteOneLinerInteraction(interactionId: string) {
    await prisma.oneLinerInteraction.delete({
        where: {
            id: interactionId,
        }
    });

    revalidatePath("/one-liner")
}