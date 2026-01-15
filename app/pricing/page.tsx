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

    const tier1Url = '/placeholder.com';
    const tier2Url = '/placeholder2.com';

    return (
        <>
        <div className="h-screen overflow-y-auto">
            <PricingPageClient user={user} tier1={tier1Url} tier2={tier2Url} />
        </div>
        
        </>
    )
}