"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { SidebarItem } from "../../components/SidebarItem";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const session = useSession();

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user} />
      </div>
      
      <div className="flex flex-1 pt-16 overflow-hidden">
        <aside className="w-72 bg-white border-r border-slate-200 shadow-lg fixed left-0 top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="space-y-1 p-4">
            <div className="px-4 py-4 mb-2">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Navigation</h2>
            </div>
            <SidebarItem href={"/dashboard"} icon={<HomeIcon />} title="Dashboard" />
            <SidebarItem href={"/transfer"} icon={<AddMoneyIcon />} title="Add Money" />
            <SidebarItem href={"/transactions"} icon={<TransactionsIcon />} title="Transactions" />
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-slate-50">
            <div className="text-xs text-slate-500">
              <p className="font-semibold mb-2">Wallet Balance</p>
              <p className="text-sm text-slate-700">Loading...</p>
            </div>
          </div>
        </aside>

        <main className="ml-72 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// Icons Fetched from https://heroicons.com/
function HomeIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
}

function AddMoneyIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
}

function TransactionsIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
}