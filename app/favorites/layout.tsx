import type { Metadata } from "next";
import "../globals.css";

import UnivNavBar from "../components/site/UnivNavbar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/site/AppSidebar";
import BottomNewsletter from "../components/site/BottomNewsletter";

export const metadata: Metadata = {
  title: "Favorites",
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased">
      <UnivNavBar />

      <div className="flex pt-[65px] max-h-screen ">
        <SidebarProvider>
          <div className="hidden lg:block">
            <AppSidebar />
          </div>
          <main className="flex-1 px-6 overflow-y-auto pb-[100px] sm:px-0">
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
