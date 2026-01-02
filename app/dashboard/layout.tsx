import type { Metadata } from "next";
import "../globals.css";

import UnivNavBar from "../components/site/UnivNavbar";
import { SidebarProvider } from "../components/ui/sidebar";
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
    <div className="antialiased overflow-hidden">
      <UnivNavBar />

      <div className="flex pt-[85px] pb-[40px] h-[calc(100vh-85px-40px)] overflow-hidden">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 px-6 py-6 overflow-y-auto">
            <div className="text-2xl text-black font-semibold pb-3">
              Investor Index
            </div>
            {children}
          </main>
        </SidebarProvider>
      </div>

      {/*  */}
    </div>
  );
}
