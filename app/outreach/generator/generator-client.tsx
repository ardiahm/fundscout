"use client";

import OutreachGeneratorForm from "@/app/components/site/outreach/outreach-generator-form";

export default function OutreachGeneratorClient() {

  return (
    <div className="flex min-h-screen w-full overflow-y-auto justify-center">
      <div className="w-full max-w-4xl">
        <OutreachGeneratorForm />
      </div>
    </div>
  );
}
