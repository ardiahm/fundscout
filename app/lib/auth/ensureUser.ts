import {auth} from "@clerk/nextjs/server"
import {prisma} from "../../../backend/lib/prisma"     
import {PrismaPg} from '@prisma/adapter-pg'

export async function ensureUser() {
    const {userId} = await auth();
    if (!userId) return null;
    
    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId}
    });

    if (!user) {
        await prisma.user.create({
            data: {
                clerkUserId: userId,
            },
        });
    }

    return user;

    
}

