"use client"
import { Card } from "../../../packages/ui/src/card";
import { Select } from "../../../packages/ui/src/Select";
import { useState } from "react";
import { TextInput } from "../../../packages/ui/src/TextInput";
import { createOnRampTransaction } from "../app/lib/actions/createOnrampTransaction";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [value, setValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [transactionData, setTransactionData] = useState<{token: string, userId: string, amount: number} | null>(null);
    const [copied, setCopied] = useState<string>("");
    
    const handleAddMoney = async () => {
        if (value <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        setIsLoading(true);
        try {
            const result = await createOnRampTransaction(provider, value);
            if (result.token) {
                setTransactionData({
                    token: result.token,
                    userId: result.userId || "",
                    amount: value * 100
                });
                setShowModal(true);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error creating transaction:", error);
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(""), 2000);
    };
    
    return (
        <>
            <Card title="Add Money to Wallet" href="">
                <div className="w-full space-y-6">
                    <div>
                        <div className="block text-sm font-semibold text-slate-700 mb-3">Amount</div>
                        <div className="relative">
                            <TextInput 
                                label="Amount"
                                placeholder="Enter amount in ₹" 
                                onChange={(val) => setValue(Number(val))} 
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Enter the amount you want to add to your wallet</p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Select Bank</label>
                        <Select 
                            onSelect={(value) => {
                                setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "");
                                setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "");
                            }} 
                            options={SUPPORTED_BANKS.map(x => ({
                                key: x.name,
                                value: x.name
                            }))} 
                        />
                        <p className="text-xs text-slate-500 mt-2">Choose your bank for secure payment</p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200">
                        <button 
                            onClick={handleAddMoney}
                            disabled={isLoading || value <= 0}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Processing..." : `Add ₹${value} to Wallet`}
                        </button>
                    </div>
                </div>
            </Card>

            {showModal && transactionData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Transaction Created</h3>
                        <p className="text-sm text-slate-600 mb-6">Copy the details below and use them in the Webhook Simulator to complete the transaction</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Transaction Token</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={transactionData.token} 
                                        readOnly 
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm font-mono"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(transactionData.token, 'token')}
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                                    >
                                        {copied === 'token' ? '✓' : 'Copy'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">User ID</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={transactionData.userId} 
                                        readOnly 
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm font-mono"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(transactionData.userId, 'userId')}
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                                    >
                                        {copied === 'userId' ? '✓' : 'Copy'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (in paise)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={transactionData.amount} 
                                        readOnly 
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm font-mono"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(transactionData.amount.toString(), 'amount')}
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                                    >
                                        {copied === 'amount' ? '✓' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => window.location.href = redirectUrl || ""}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 px-4 rounded-lg"
                            >
                                Continue to Bank
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}