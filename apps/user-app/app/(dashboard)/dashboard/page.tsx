import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getBalance() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return {
            amount: 0,
            locked: 0
        }
    }
    const balance = await prisma.balance.findFirst({
        where: {
            userId: parseInt(session.user.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return [];
    }
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: parseInt(session.user.id)
        },
        orderBy: {
            startTime: "desc"
        },
        take: 5
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }));
}

export default async function Dashboard() {
    const balance = await getBalance();
    const onRampTransactions = await getOnRampTransactions();
    
    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
                    <p className="text-slate-600">Welcome to your wallet</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-8">
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                </div>
                
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900">Recent Transactions</h2>
                        <p className="text-sm text-slate-600 mt-1">Your last 5 transactions</p>
                    </div>
                    <div className="p-6">
                        <OnRampTransactions transactions={onRampTransactions} />
                    </div>
                </div>
            </div>
        </div>
    );
}