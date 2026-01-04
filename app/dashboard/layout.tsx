import type { Metadata } from "next";
import "../globals.css";

import UnivNavBar from "../components/site/UnivNavbar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/site/AppSidebar";
import BottomNewsletter from "../components/site/BottomNewsletter";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased ">
      <UnivNavBar />

      <div className="flex pt-[65px] h-[calc(100vh-95px)] overflow-hidden">
        <SidebarProvider>
          <div className="hidden lg:block">
            <AppSidebar />
          </div>
          <main className="flex-1 px-6 overflow-y-auto pb-[200px] sm:px-0">
            <div className="pl-2 pt-5 ">
              <SidebarTrigger />
            </div>
            {children}
          </main>
        </SidebarProvider>
        <BottomNewsletter />
      </div>

      {/*  */}
    </div>
  );
}
