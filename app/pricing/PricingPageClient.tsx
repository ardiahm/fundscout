"use client";

import {User} from "@/backend/lib/generated/prisma/client"

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { SearchBar } from "../components/site/SearchBar";
import {
  Card,
  CardTitle,
  CardHeader,
  CardAction,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import {PricingCardBase} from "../components/site/pricing/PricingCardBase";
import {PricingCardTier1} from "../components/site/pricing/PricingCardTier1";
import {PricingCardTier2} from "../components/site/pricing/PricingCardTier2";



type Props = {
    user: User;
    tier1: string;
    tier2: string;
}

const baseTitle = "Scout";
const tier1Title = "Founder";
const tier2Title = "Emperor";


export default function PricingPageClient({user, tier1, tier2}: Props) {

    return (
        <>
        <div className="grid grid-cols-3 space-x-3 my-15 mx-30">
            <PricingCardBase title={baseTitle}/>
            <PricingCardTier1 title={tier1Title}/>
            <PricingCardTier2 title={tier2Title}/>
        </div>
        
        </>
    );
}