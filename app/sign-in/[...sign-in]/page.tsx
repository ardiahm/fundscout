import { SignIn, useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function Page() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  
  return <SignIn forceRedirectUrl="/dashboard" />;
}
