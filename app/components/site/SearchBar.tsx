"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    console.log("received query: " + query);
    router.push(`/investors?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="gap-3 flex w-full gap-2 md:justify-end px-4 md:px-10">
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
      >
        Enter
      </Button>
    </div>
  );
}
