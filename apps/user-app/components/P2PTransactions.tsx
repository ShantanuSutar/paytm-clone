"use client"
import { Card } from "../../../packages/ui/src/card"

function getTransactionIcon(isReceived: boolean) {
    return isReceived ? "↓" : "↑";
}

export const P2PTransactions = ({
    transactions
}: {
    transactions: {
        id: number;
        amount: number;
        timestamp: Date;
        isReceived: boolean;
        otherUserName?: string;
        otherUserNumber: string;
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="P2P Transfers" href="">
            <div className="text-center py-12">
                <div className="text-slate-400 text-lg">No P2P transfers yet</div>
                <p className="text-slate-500 text-sm mt-2">Your P2P transfers will appear here</p>
            </div>
        </Card>
    }

    return <Card title="P2P Transfers" href="">
        <div className="space-y-3">
            {transactions.map((t) => {
                const isReceived = t.isReceived;
                const amountColor = isReceived ? "text-green-600" : "text-slate-800";
                const bgGradient = isReceived 
                    ? "from-green-400 to-green-600" 
                    : "from-blue-400 to-blue-600";
                const amountPrefix = isReceived ? "+ " : "- ";

                return (
                    <div 
                        key={t.id} 
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${bgGradient} rounded-full flex items-center justify-center text-white font-semibold text-lg`}>
                                    {getTransactionIcon(isReceived)}
                                </div>
                                <div>
                                    <div className="font-medium text-slate-800">
                                        {isReceived ? "Received from" : "Sent to"} {t.otherUserName || t.otherUserNumber}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        {t.timestamp instanceof Date 
                                            ? t.timestamp.toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : new Date(t.timestamp).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className={`font-semibold ${amountColor} text-lg`}>
                                    {amountPrefix}₹{(t.amount / 100).toFixed(2)}
                                </div>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${isReceived ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                                    {isReceived ? "Received" : "Sent"}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </Card>
}
