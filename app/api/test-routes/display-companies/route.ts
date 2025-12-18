/**
 * This file is used to display all companies.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.company.findMany();
    return NextResponse.json(companies);
  } catch (error) {
    console.error("DB test failed:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}
