import prisma from "@repo/db/client";
import { P2PTransactions } from "../../../components/P2PTransactions";
import { BalanceCard } from "../../../components/BalanceCard";
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

async function getP2PTransactions() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return [];
    }

    const userId = parseInt(session.user.id);

    // Get all P2P transfers where user is either sender or receiver
    const transfers = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        },
        include: {
            fromUser: {
                select: {
                    id: true,
                    name: true,
                    number: true
                }
            },
            toUser: {
                select: {
                    id: true,
                    name: true,
                    number: true
                }
            }
        },
        orderBy: {
            timestamp: "desc"
        }
    });

    return transfers.map(t => ({
        id: t.id,
        amount: t.amount,
        timestamp: t.timestamp,
        isReceived: t.toUserId === userId,
        otherUserName: t.fromUserId === userId ? t.toUser.name : t.fromUser.name,
        otherUserNumber: t.fromUserId === userId ? t.toUser.number : t.fromUser.number
    }));
}

export default async function P2P() {
    const balance = await getBalance();
    const p2pTransactions = await getP2PTransactions();

    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">P2P Transfers</h1>
                    <p className="text-slate-600">View your peer-to-peer transaction history</p>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-8">
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <P2PTransactions transactions={p2pTransactions} />
                    </div>
                </div>

                {p2pTransactions.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-600 font-medium">Total Transfers</p>
                                <p className="text-2xl font-bold text-blue-900 mt-2">{p2pTransactions.length}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-600 font-medium">Total Received</p>
                                <p className="text-2xl font-bold text-green-900 mt-2">
                                    ₹{(p2pTransactions
                                        .filter(t => t.isReceived)
                                        .reduce((sum, t) => sum + t.amount, 0) / 100).toFixed(2)}
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-sm text-slate-600 font-medium">Total Sent</p>
                                <p className="text-2xl font-bold text-slate-900 mt-2">
                                    ₹{(p2pTransactions
                                        .filter(t => !t.isReceived)
                                        .reduce((sum, t) => sum + t.amount, 0) / 100).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
