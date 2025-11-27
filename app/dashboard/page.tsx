"use client"

import { AppSidebar } from "@/components/site/AppSidebar";
import UnivNavBar from "@/components/site/UnivNavbar";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";

export default function Dashboard() {
  return (
    <>
    <div className="text-xl text-black font-semibold">FS Dashboard</div>
    <Label>Search and filter through investors here</Label>
    </>
  );
}
