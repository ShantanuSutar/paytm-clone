import { Card } from "../../../packages/ui/src/card"

function getStatusColor(status: string) {
    switch(status) {
        case "Success":
            return "bg-green-100 text-green-800";
        case "Processing":
            return "bg-yellow-100 text-yellow-800";
        case "Failed":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions" href="">
            <div className="text-center py-12">
                <div className="text-slate-400 text-lg">No transactions yet</div>
                <p className="text-slate-500 text-sm mt-2">Your transactions will appear here</p>
            </div>
        </Card>
    }
    return <Card title="Recent Transactions" href="">
        <div className="space-y-3">
            {transactions.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {t.provider.charAt(0)}
                            </div>
                            <div>
                                <div className="font-medium text-slate-800">{t.provider}</div>
                                <div className="text-xs text-slate-500 mt-1">
                                    {t.time instanceof Date ? t.time.toLocaleDateString('en-IN') : new Date(t.time).toLocaleDateString('en-IN')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-semibold text-green-600 text-lg">+ ₹{(t.amount / 100).toFixed(2)}</div>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getStatusColor(t.status)}`}>
                                {t.status}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
}