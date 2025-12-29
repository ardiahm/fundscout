import type { Metadata } from "next";
import "../../globals.css";

import UnivNavBar from "../../components/site/UnivNavbar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/site/AppSidebar";
import BottomNewsletter from "../../components/site/BottomNewsletter";
import { Button } from "@/app/components/ui/button";

export const metadata: Metadata = {
  title: "Investor Profile",
};

export default function InvestorProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased h-screen">
      <UnivNavBar />
      <div className="flex pt-[80px] h-[calc(100vh-85px-40px)] mb-30">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 pt-6 pb-30 overflow-y-auto">
            <div className="pl-2">
              <SidebarTrigger />
            </div>
            {children}
            </main>
          
        </SidebarProvider>
      </div>
      
      <BottomNewsletter />
    </div>
  );
}
