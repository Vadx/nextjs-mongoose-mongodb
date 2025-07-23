import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Task Management API
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A comprehensive task management application built with Next.js,
          TypeScript, MongoDB, and NextAuth for secure authentication.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
