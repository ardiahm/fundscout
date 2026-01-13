import {ensureUser} from "@/app/lib/auth/ensureUser";
import {redirect} from "next/navigation"
import {auth} from "@clerk/nextjs/server"
import PricingPageClient from "./PricingPageClient"

export default async function PricingPage() {
    const user = await ensureUser();
    const {userId} = await auth();

    if (!user || !userId) {
        redirect('/sign-in')
    }

    return (
        <>
        <PricingPageClient user={user} />
        </>
    )
}