"use client"
import { Button } from "../../../packages/ui/src/button";
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
    
    const handleAddMoney = async () => {
        if (value <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        setIsLoading(true);
        try {
            await createOnRampTransaction(provider, value);
            setTimeout(() => {
                window.location.href = redirectUrl || "";
            }, 2100);
        } catch (error) {
            console.error("Error creating transaction:", error);
            setIsLoading(false);
        }
    };
    
    return <Card title="Add Money to Wallet" href="">
        <div className="w-full space-y-6">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Amount</label>
                <div className="relative">
                    {/* <span className="absolute left-4 top-3 text-slate-500 font-semibold"></span> */}
                    <TextInput 
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
                <Button 
                    onClick={handleAddMoney}
                    disabled={isLoading || value <= 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                >
                    {isLoading ? "Processing..." : `Add ₹${value} to Wallet`}
                </Button>
                <p className="text-xs text-slate-500 text-center mt-3">You will be redirected to your bank's website</p>
            </div>
        </div>
    </Card>
}