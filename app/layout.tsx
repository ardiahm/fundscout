import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import UnivNavBar from "@/components/site/UnivNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/site/AppSidebar";
import BottomNewsletter from "@/components/site/BottomNewsletter";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <UnivNavBar />

        {/* Sidebar + main content */}
        <div className="flex pt-[85px] pb-[40px] h-[calc(100vh-85px-40px)] overflow-hidden">
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 px-6 py-6 overflow-y-auto">{children}</main>
          </SidebarProvider>
        </div>

        <BottomNewsletter />
      </body>
    </html>
  );
}
