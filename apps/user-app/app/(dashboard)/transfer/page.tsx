import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

export default async function Transfer() {
    const balance = await getBalance();
    
    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Add Money</h1>
                    <p className="text-slate-600">Top up your wallet securely</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-8">
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <AddMoney />
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">How it works</h3>
                        <ol className="space-y-4 text-sm text-slate-700">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">1</span>
                                <span>Enter the amount you want to add</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">2</span>
                                <span>Select your preferred bank</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">3</span>
                                <span>Click \"Add Money\" button</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">4</span>
                                <span>Complete bank authentication</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">5</span>
                                <span>Amount added instantly to wallet</span>
                            </li>
                        </ol>
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800"><span className="font-semibold">✓ Secure:</span> All transactions are encrypted and secure</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}