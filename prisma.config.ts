import path from "path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// FORCE LOAD the .env manually
dotenv.config({ path: path.resolve(__dirname, ".env") });

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is missing! prisma.config.ts cannot continue.");
  process.exit(1);
}

export default defineConfig({
  schema: path.resolve(__dirname, "prisma/schema.prisma"),
  migrations: {
    path: path.resolve(__dirname, "migrations"),
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
