"use client";

import OneLinerGenerator from "@/app/components/site/oneliner-generator-card";

export default function OutreachGeneratorClient() {

  return (
    <div className="flex min-h-screen w-full overflow-y-auto justify-center">
      <div className="w-full max-w-4xl">
        <OneLinerGenerator />
      </div>
    </div>
  );
}
