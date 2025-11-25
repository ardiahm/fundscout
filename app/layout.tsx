import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UnivNavBar from "@/components/site/UnivNavbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/site/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Invest",
  description: "Find the Best Investor for your Startup",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Fixed Navbar */}
        <UnivNavBar />

        {/* Page layout offset BELOW the navbar */}
        <div className="pt-[100px] flex">

          {/* Sidebar system */}
          <SidebarProvider>
            <AppSidebar />

            {/* Content */}
            <SidebarTrigger>
              <main className="flex-1">{children}</main>
            </SidebarTrigger>
          </SidebarProvider>

        </div>
      </body>
    </html>
  );
}
