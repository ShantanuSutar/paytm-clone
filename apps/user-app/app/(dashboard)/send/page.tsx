import prisma from "@repo/db/client";
import { SendCard } from "../../../components/SendCard";
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

export default async function Send() {
    const balance = await getBalance();
    
    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Send Money</h1>
                    <p className="text-slate-600">Transfer money to another user's wallet</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-8">
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <SendCard />
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">How it works</h3>
                        <ol className="space-y-4 text-sm text-slate-700">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">1</span>
                                <span>Enter the recipient's 10-digit phone number</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">2</span>
                                <span>Enter the amount to send (in paise)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">3</span>
                                <span>Click "Send Money" button</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">4</span>
                                <span>Money is instantly transferred</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">5</span>
                                <span>Both users can see the transaction</span>
                            </li>
                        </ol>
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800"><span className="font-semibold">💡 Note:</span> You need enough balance to send money. The recipient must have a registered account with their phone number.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
