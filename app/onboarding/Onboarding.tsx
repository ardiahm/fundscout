"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { useState } from "react";

// replace dash with space in component
type Industry =
  | "ai"
  | "fintech"
  | "healthtech"
  | "climate"
  | "saas"
  | "consumer"
  | "marketplace"
  | "web3"
  | "edtech"
  | "creator-economy"
  | "dev-tools"
  | "ecommerce"
  | "enterprise"
  | "other";

// replace dash with space in component
type Goal =
  | "expedite-launch"
  | "raise-capital"
  | "read-investor-news"
  | "long-term-partnership"
  | "acquisition"
  | "evaluation";

type OnboardingData = {
  builderType?: "solo" | "collaborative";
  stage?: "ideation" | "mvp" | "validation" | "raising-funds";

  industries?: Industry[];
  goals?: Goal[];
};

export default function Onboarding() {
  const [error, setError] = React.useState("");
  const { user, isLoaded } = useUser();

  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});

  if (!isLoaded) return null;

  let content: React.ReactNode;

  switch (step) {
    case 0:
      content = (
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <div className="text-center">
              <CardTitle className="text-3xl font-semibold">
                Welcome to Fund<span className="text-blue-600">Scout</span>
              </CardTitle>
              <CardDescription className="text-black">
                We'll ask a few quick questions before you can hit the ground
                running!
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <div className="pb-12">
              <CardTitle className="pb-4">
                What kind of builder are you?
              </CardTitle>

              <RadioGroup
                value={data.builderType}
                onValueChange={(value) => {
                  setData((prev) => ({
                    ...prev,
                    builderType: value as OnboardingData["builderType"],
                  }));
                  setStep(1);
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="solo" id="solo" />
                  <label htmlFor="solo">Solo-preneur</label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="collaborative" />
                  <label htmlFor="collaborative">Collaborative Engineer</label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      );
      break;

    case 1:
      content = (
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>What stage are you in?</CardTitle>
          </CardHeader>

          <CardContent>
            <RadioGroup
              value={data.stage}
              onValueChange={(value) => {
                setData((prev) => ({
                  ...prev,
                  stage: value as OnboardingData["stage"],
                }));
                setStep(2);
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ideation" />
                <label htmlFor="ideation">Ideation</label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mvp" />
                <label htmlFor="mvp">Building MVP</label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="valuation" />
                <label htmlFor="validation">
                  Market Validation / Distribution
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="raising-money" />
                <label htmlFor="raising-funds">Raising Funds</label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      );
      break;

    case 2:
      content = (
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>You're all set 🎉</CardTitle>
            <CardDescription>
              We’ll tailor FundScout to your goals.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <button
              className="w-full bg-blue-600 text-white rounded-md py-2"
              onClick={async () => {
                const res = await completeOnboarding(data as any);
                if (!res?.error) {
                  await user?.reload();
                  router.push("/dashboard");
                } else {
                  setError(res.error);
                }
              }}
            >
              Finish setup
            </button>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>
      );
      break;

    default:
      return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {content}
    </div>
  );
}
