import type { Metadata } from "next";
import "../globals.css";

import UnivNavBar from "../components/site/UnivNavbar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/site/AppSidebar";
import BottomNewsletter from "../components/site/BottomNewsletter";
import {Toaster} from "@/app/components/ui/sonner";

export const metadata: Metadata = {
  title: "One Liner Generator",
};

export default function OneLinerClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<div className="antialiased h-screen overflow-hidden">     
   <UnivNavBar />
      <div className="flex pt-[80px] h-[calc(100vh-85px-40px)]">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 pt-1 min-h-0 min-w-0 overflow-y-auto">
            <div className="pl-2">
              <SidebarTrigger />
            </div>
            <div className="pb-30">{children}</div>
            </main>
            <Toaster />
          
        </SidebarProvider>
      </div>
      
      {/* <BottomNewsletter /> */}
    </div>
  );
}
