import { Card } from "../../../packages/ui/src/card";

export const BalanceCard = ({amount, locked}: {
    amount: number;
    locked: number;
}) => {
    const totalBalance = (locked + amount) / 100;
    
    return <Card title={"Balance"} href={""}>
        <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="text-sm font-medium text-slate-600 mb-1">Unlocked Balance</div>
                <div className="text-3xl font-bold text-blue-600">₹{(amount / 100).toFixed(2)}</div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                <div className="text-sm font-medium text-slate-600 mb-1">Locked Balance</div>
                <div className="text-2xl font-bold text-amber-600">₹{(locked / 100).toFixed(2)}</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <div className="text-sm font-medium text-slate-600 mb-1">Total Balance</div>
                <div className="text-3xl font-bold text-green-600">₹{totalBalance.toFixed(2)}</div>
            </div>
        </div>
    </Card>
}