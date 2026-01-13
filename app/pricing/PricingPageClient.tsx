"use client";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { SearchBar } from "../components/site/SearchBar";
import {User} from "@/backend/lib/generated/prisma/client"

type Props = {
    user: User;
}

export default function PricingPageClient({user}: Props) {

    return (
        <>
        </>
    );
}