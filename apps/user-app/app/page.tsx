"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page(): JSX.Element {
  const session = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/api/auth/signin");
    } else if (session.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session.status, router]);

  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session.data?.user) {
    return <div>Redirecting to login...</div>;
  }
  
  return null;
}
