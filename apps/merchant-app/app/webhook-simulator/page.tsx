"use client"
import { useState } from "react";
import { Button } from "../../../packages/ui/src/button";
import { Card } from "../../../packages/ui/src/card";
import { TextInput } from "../../../packages/ui/src/TextInput";

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

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("http://localhost:3003/hdfcWebhook", {
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
                setMessage(`✓ Webhook triggered successfully: ${data.message}`);
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
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card title="Bank Webhook Simulator" href="">
                <div className="w-full max-w-md space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Transaction Token</label>
                        <TextInput
                            placeholder="Enter token from onRamp transaction"
                            value={token}
                            onChange={(val) => setToken(val)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">User ID</label>
                        <TextInput
                            placeholder="Enter user ID"
                            value={userId}
                            onChange={(val) => setUserId(val)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Amount (in paise)</label>
                        <TextInput
                            placeholder="Enter amount (e.g., 1000 for ₹10)"
                            value={amount}
                            onChange={(val) => setAmount(val)}
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button 
                            onClick={handleSimulateWebhook}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Simulate Webhook"}
                        </Button>
                    </div>

                    {message && (
                        <div className="p-3 bg-green-100 text-green-800 rounded text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-100 text-red-800 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="mt-6 p-3 bg-blue-50 rounded text-sm text-gray-700">
                        <p className="font-semibold mb-2">How to use:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Create an onRamp transaction from the user app</li>
                            <li>Copy the transaction token from the database</li>
                            <li>Enter the token, user ID, and amount here</li>
                            <li>Click "Simulate Webhook" to trigger the payment callback</li>
                            <li>Check your balance - it should be updated!</li>
                        </ol>
                    </div>
                </div>
            </Card>
        </div>
    );
}
