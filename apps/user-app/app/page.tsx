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
    }
  }, [session.status, router]);

  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session.data?.user) {
    return <div>Redirecting to login...</div>;
  }
  
  return (
    <div>
      <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user} />
      <div className="w-full">
        <div className="text-2xl text-bold pt-4 m-8">
          Welcome back, {session.data?.user?.name || "User"}!
        </div>
        <div className="grid grid-cols-3 gap-4 m-8">
          <div className="p-4 border border-slate-300 rounded">
            <h3 className="font-bold mb-2">Balance</h3>
            <div className="text-2xl font-bold">
              ₹ 0.00
            </div>
          </div>
          <div className="p-4 border border-slate-300 rounded">
            <h3 className="font-bold mb-2">Send Money</h3>
            <div className="text-center">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Send
              </button>
            </div>
          </div>
          <div className="p-4 border border-slate-300 rounded">
            <h3 className="font-bold mb-2">Receive Money</h3>
            <div className="text-center">
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Receive
              </button>
            </div>
          </div>
        </div>
        <div className="m-8">
          <div className="text-xl font-bold mb-4">Recent Transactions</div>
          <div className="p-4 border border-slate-300 rounded">
            <div className="text-gray-500 text-center py-8">
              No transactions yet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
