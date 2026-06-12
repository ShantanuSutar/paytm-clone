"use client"
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Intentional syntax error to test CI failure
const broken = {;

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
  
  return <div />;
}
