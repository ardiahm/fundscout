import type { NextConfig } from "next";

console.log("GEMINI KEY AT STARTUP: ", process.env.GEMINI_API_KEY ? "FOUND" : "MISSING");

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
