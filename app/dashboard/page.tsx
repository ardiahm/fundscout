"use client";

import { AppSidebar } from "@/components/site/AppSidebar";
import UnivNavBar from "@/components/site/UnivNavbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as Avatar from "@radix-ui/react-avatar";
import Image from "next/image";

export default function Dashboard() {
  return (
    <>
      <div className="text-xl text-black font-semibold pb-3">FS Dashboard</div>
      {/* Parent Container (GAP 4) */}
      <div className="w-full h-screen flex gap-4">
        {/* Left Container (2/3 width) */}
        <div className="w-2/3 p-4">
          {/* Search and Submit Button */}
          <div className="flex w-full max-w-md items-center gap-2">
            <Input
              type="search"
              placeholder="Search for VCs, Angels, and other funds"
            />
            <Button type="submit" variant="outline">
              Enter
            </Button>
          </div>

          {/* Results Fields (alternate bg colors) */}

          <div className="py-4 space-y-0">
            {/* Row 1 */}
            <div className="w-full bg-blue-100 py-3 px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
                  <Avatar.Image src="/avatar1.png" alt="John Smith" />
                  <Avatar.Fallback className="text-sm pl-2 pt-2">JS</Avatar.Fallback>
                </Avatar.Root>
                <span className="font-medium">John Smith</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-700">
                <span>⭐ 92</span>
                <span>📈 14%</span>
                <span>📊 230 posts</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="w-full py-3 px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
                  <Avatar.Image src="/avatar2.png" alt="Sam Altman" />
                  <Avatar.Fallback className="text-sm">SA</Avatar.Fallback>
                </Avatar.Root>
                <span className="font-medium">Sam Altman</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-700">
                <span>⭐ 81</span>
                <span>📈 9%</span>
                <span>📊 120 posts</span>
              </div>
            </div>

            {/* Repeat pattern for the rest */}
          </div>
        </div>

        {/* Right Containter (final 1/3 width) */}
        <div className="w-1/3 bg-gray-100 p-4">Right content</div>
      </div>
    </>
  );
}
