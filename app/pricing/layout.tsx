import type { Metadata } from "next";
import "../globals.css";

import UnivNavBar from "../components/site/UnivNavbar";
import { Toaster } from "@/app/components/ui/sonner";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased h-screen overflow-y-auto">
      <UnivNavBar />
      {/* mounted before children so toasts fired on page load are caught */}
      <Toaster position="bottom-center" />
      <main className="pt-[80px] pb-16">{children}</main>
    </div>
  );
}
