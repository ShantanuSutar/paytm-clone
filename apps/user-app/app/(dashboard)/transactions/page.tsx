import prisma from "@repo/db/client";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

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
        }
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }));
}

export default async function Transactions() {
    const onRampTransactions = await getOnRampTransactions();
    
    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Transaction History</h1>
                    <p className="text-slate-600">View all your wallet transactions</p>
                </div>
                
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900">All Transactions</h2>
                        <p className="text-sm text-slate-600 mt-1">Complete transaction history</p>
                    </div>
                    <div className="p-6">
                        <OnRampTransactions transactions={onRampTransactions} />
                    </div>
                </div>
            </div>
        </div>
    );
}