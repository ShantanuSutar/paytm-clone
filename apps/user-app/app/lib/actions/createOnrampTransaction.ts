"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction(provider: string, amount: number) {
    // Ideally the token should come from the banking provider (hdfc/axis)
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }
    const token = (Math.random() * 1000).toString();
    const userId = Number(session?.user?.id);
    const amountInPaise = amount * 100;

    await prisma.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: userId,
            amount: amountInPaise
        }
    });

    // Simulate webhook callback after 2 seconds
    setTimeout(async () => {
        try {
            const webhookUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            await fetch(`${webhookUrl}/api/webhooks/hdfc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    user_identifier: userId.toString(),
                    amount: amountInPaise.toString(),
                }),
            });
        } catch (error) {
            console.error("Failed to trigger webhook:", error);
        }
    }, 2000);

    return {
        message: "Done"
    }
}
