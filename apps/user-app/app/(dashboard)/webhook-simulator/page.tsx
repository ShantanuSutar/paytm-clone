"use client"
import { useState } from "react";
import { Card } from "../../../../../packages/ui/src/card";
import { TextInput } from "../../../../../packages/ui/src/TextInput";
import { Button } from "../../../../../packages/ui/src/button";

export default function WebhookSimulator() {
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSimulateWebhook = async () => {
        if (!token || !userId || !amount) {
            setError("All fields are required");
            return;
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/webhooks/hdfc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    user_identifier: userId,
                    amount: amount,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✓ Webhook triggered successfully! ${data.message}`);
                setToken("");
                setUserId("");
                setAmount("");
            } else {
                setError(`✗ Error: ${data.message || "Failed to trigger webhook"}`);
            }
        } catch (err) {
            setError(`✗ Connection error: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Webhook Simulator</h1>
                    <p className="text-slate-600">Test bank webhook callbacks for payment transactions</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card title="Simulate Bank Webhook" href="">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Transaction Token
                                    </label>
                                    <TextInput
                                        placeholder="Enter the token from onRamp transaction"
                                        value={token}
                                        onChange={(val) => setToken(val)}
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        This token is generated when you create a new onRamp transaction
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        User ID
                                    </label>
                                    <TextInput
                                        placeholder="Enter user ID"
                                        value={userId}
                                        onChange={(val) => setUserId(val)}
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        Your authenticated user ID
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Amount (in paise)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-slate-500 font-semibold">₹</span>
                                        <TextInput
                                            placeholder="Enter amount (e.g., 1000 for ₹10)"
                                            value={amount}
                                            onChange={(val) => setAmount(val)}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Amount in paise (100 paise = ₹1)
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-200">
                                    <Button
                                        onClick={handleSimulateWebhook}
                                        disabled={loading || !token || !userId || !amount}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold disabled:opacity-50"
                                    >
                                        {loading ? "Processing..." : "Trigger Webhook"}
                                    </Button>
                                </div>

                                {message && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-800">{message}</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">How it works</h3>
                                <ol className="space-y-4 text-sm text-slate-700">
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs">1</span>
                                        <span>Create an onRamp transaction from the Add Money page</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs">2</span>
                                        <span>Get the transaction token from database or logs</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs">3</span>
                                        <span>Enter your User ID and desired amount</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs">4</span>
                                        <span>Click "Trigger Webhook" to simulate bank callback</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs">5</span>
                                        <span>Your balance will be updated automatically</span>
                                    </li>
                                </ol>
                            </div>

                            <div className="pt-4 border-t border-slate-200">
                                <h4 className="font-semibold text-slate-900 mb-3">What happens:</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>Transaction status changes to "Success"</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>User balance is incremented</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>Money appears in wallet instantly</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-xs text-amber-800">
                                    <span className="font-semibold">⚠ Dev Tool:</span> This is for testing only. In production, webhooks come from actual banks.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
