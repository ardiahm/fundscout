"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import OnboardingCard from "./components/OnboardingCard";

// replace dash with space in component
export const INDUSTRIES = [
  "ai",
  "fintech",
  "healthtech",
  "climate",
  "saas",
  "consumer",
  "marketplace",
  "web3",
  "edtech",
  "creator-economy",
  "dev-tools",
  "ecommerce",
  "enterprise",
  "blockchain",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

// replace dash with space in component
export const GOALS = [
  "expedite-launch",
  "raise-capital",
  "read-investor-news",
  "long-term-partnership",
  "acquisition",
  "evaluation",
] as const;

export type Goal = (typeof GOALS)[number];

export type OnboardingData = {
  builderType?: "solo" | "collaborative";
  stage?: "ideation" | "mvp" | "validation" | "raising-funds";

  industries?: Industry[];
  goals?: Goal[];
};

const onboardingQuestions = [
  {
    key: "builderType",
    prompt: "What kind of builder are you?",
    options: ["solo", "collaborative"] as const,
    multiple: false,
  },
  {
    key: "stage",
    prompt: "What stage is your project currently in?",
    options: ["ideation", "mvp", "validation", "raising-funds"],
    multiple: false,
  },
  {
    key: "industries",
    prompt: "Which industries will you innovate in?",
    options: INDUSTRIES,
    multiple: true,
  },
  {
    key: "goals",
    prompt: "What goals do you have with FundScout?",
    options: GOALS,
    multiple: true,
  },
] as const;

export default function OnboardingClient() {
  const { user, isLoaded } = useUser();
  // useState and Const declarations
  // needs error and set error, user and is loaded, router, step and setStep, data and setData
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const router = useRouter();

  const searchParams = useSearchParams();

  if (!isLoaded) return null;

  const devBypass = searchParams.get("dev") === "true";
  const hasOnboarded = user?.publicMetadata?.onboardingComplete === true;

  if (hasOnboarded && !devBypass) {
    return null;
  }

  const question = onboardingQuestions[step];

  const handleComplete = async () => {

    await completeOnboarding(data as OnboardingData);
    router.push("/dashboard");
  };

  const handleNext = () => {
    const currentQuestion = onboardingQuestions[step];
    const currentValue = data[currentQuestion.key];

    const isValid = currentQuestion.multiple
      ? Array.isArray(currentValue) && currentValue.length > 0
      : typeof currentValue === "string" && currentValue.length > 0;

    if (!isValid) return; // stop if nothing selected

    if (step === onboardingQuestions.length - 1) {
      handleComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const isLastStep = step === onboardingQuestions.length - 1;

  const isFirstStep = step === 0;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-30">
      {/* width container */}
      <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl">
        {/* animation wrapper */}
        <div
          key={step}
          className="animate-in fade-in slide-in-from-right-4 duration-600"
        >
          <OnboardingCard
            prompt={question.prompt}
            options={question.options}
            multiple={question.multiple}
            value={data[question.key]}
            onChange={(value) =>
              setData((prev) => ({
                ...prev,
                [question.key]: value,
              }))
            }
            isFirstStep={isFirstStep}
            onBack={() => setStep((s) => Math.max(0, s - 1))}
            isLastStep={isLastStep}
            onNext={handleNext}
          />
          
        </div>
      </div>
    </div>
  );
}
