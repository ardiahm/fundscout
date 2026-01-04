"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import OnboardingClient from "./OnboardingClient"

export default function OnboardingComponent() {
  const [error, setError] = React.useState("");
  const { user } = useUser();
  const router = useRouter();


  return (
    <div className="">
      <OnboardingClient />
    </div>
  );
}
