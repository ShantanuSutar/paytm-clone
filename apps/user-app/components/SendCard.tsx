"use client"
import { Button } from "../../../packages/ui/src/button";
import { Card } from "../../../packages/ui/src/card";
import { useState } from "react";
import { TextInput } from "../../../packages/ui/src/TextInput";
import { useRouter } from "next/navigation";

export const SendCard = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    
    const handleSendMoney = async () => {
        // Clear previous messages
        setMessage("");
        setError("");

        // Validation
        if (!phoneNumber.trim()) {
            setError("Please enter a phone number");
            return;
        }

        if (!/^\d{10}$/.test(phoneNumber)) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        const amountNum = Number(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setError("Please enter a valid amount (greater than 0)");
            return;
        }

        if (!Number.isInteger(amountNum)) {
            setError("Amount must be a whole number");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/user/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber,
                    amount: amountNum,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✓ Successfully sent ₹${(amountNum / 100).toFixed(2)} to ${phoneNumber}!`);
                setPhoneNumber("");
                setAmount("");
                // Refresh the page after 1.5 seconds to show updated balance
                setTimeout(() => {
                    router.refresh();
                }, 1500);
            } else {
                setError(`✗ ${data.message || "Failed to send money"}`);
            }
        } catch (err) {
            setError(`✗ Connection error: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card title="Send Money to Wallet" href="">
            <div className="w-full space-y-6">
                <div>
                    <TextInput
                        label="Recipient Phone Number"
                        placeholder="Enter 10-digit phone number"
                        onChange={(val) => setPhoneNumber(val)}
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        The phone number of the person you want to send money to
                    </p>
                </div>

                <div>
                    <TextInput
                        label="Amount (in paise)"
                        placeholder="Enter amount (e.g., 1000 for ₹10)"
                        onChange={(val) => setAmount(val)}
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        Amount in paise (100 paise = ₹1)
                    </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                    <button
                        onClick={handleSendMoney}
                        disabled={isLoading || !phoneNumber || !amount}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Sending..." : "Send Money"}
                    </button>
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
    );
};
