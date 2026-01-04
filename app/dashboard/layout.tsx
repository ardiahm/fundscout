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
    <div className="antialiased ">
      <UnivNavBar />

<div className="flex pt-[85px] h-[calc(100vh-85px-0px)] overflow-hidden">
        <SidebarProvider>
          <div className="hidden lg:block">
            <AppSidebar />
          </div>
          <main className="flex-1 px-6 py-6 overflow-y-auto pb-[200px] sm:px-0">
            {children}
          </main>
        </SidebarProvider>
      </div>

      {/*  */}
    </div>
  );
}
