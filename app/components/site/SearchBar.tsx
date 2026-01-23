"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export function SearchBar({correctURL, }: {correctURL: string}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const handleSubmit = () => {
    console.log("received query: " + query);

    if (!query) {
      router.push(`/${correctURL}`);
    } else {
      router.push(`/${correctURL}?search=${encodeURIComponent(query)}`);
    }
  };

  const handleReset = () => {
    console.log("resetting search")
      router.push(`/${correctURL}`);
  };

  // if there is no query, check if there is a search, if there is- return true (button is NOT disabled)
  // if there is a query, return true right away (button is NOT disabled)
  const handleDisabledResetButton = () => {
    console.log("handling reset");
    if (!query) {
      if (search) {
        return true;
      } else {
        return false
      }
    } else {
      return true;
    }
  }

  return (
    <div className="gap-3 flex w-full gap-2 md:justify-end px-4 md:px-10">
      <Button
        type="submit"
        variant="outline"
        className="transition delay-20 hover:border-black"
        onClick={handleReset}
        disabled={!handleDisabledResetButton()}
      >
        Reset
      </Button>
      <Input
        type="search"
        placeholder="Search for VCs, Angels, and other funds"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      />
      <Button
        type="submit"
        variant="outline"
        className="transition delay-20 hover:border-black"
        onClick={handleSubmit}
        disabled={!query}
      >
        Enter
      </Button>
    </div>
  );
}
