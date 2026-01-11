"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    try {
        // Validate authentication
        const session = await getServerSession(authOptions);
        const from = session?.user?.id;
        if (!from) {
            return {
                success: false,
                message: "Unauthorized: Please login first"
            }
        }

        // Validate phone number format
        if (!to || typeof to !== 'string') {
            return {
                success: false,
                message: "Invalid phone number"
            }
        }

        if (!/^\d{10}$/.test(to.trim())) {
            return {
                success: false,
                message: "Phone number must be 10 digits"
            }
        }

        // Validate amount
        if (typeof amount !== 'number' || isNaN(amount)) {
            return {
                success: false,
                message: "Invalid amount"
            }
        }

        if (amount <= 0) {
            return {
                success: false,
                message: "Amount must be greater than 0"
            }
        }

        if (!Number.isInteger(amount)) {
            return {
                success: false,
                message: "Amount must be a whole number (in paise)"
            }
        }

        const fromId = Number(from);

        // Find recipient by phone number
        const toUser = await prisma.user.findUnique({
            where: { number: to.trim() }
        });

        if (!toUser) {
            return {
                success: false,
                message: "Recipient not found"
            }
        }

        // Prevent self-transfer
        if (toUser.id === fromId) {
            return {
                success: false,
                message: "Cannot send money to yourself"
            }
        }

        // Atomic transaction with row locking
        try {
            await prisma.$transaction(async (tx) => {
                // Lock the sender's balance row FOR UPDATE to prevent concurrent transfers
                const fromBalance = await tx.$queryRaw`
                    SELECT * FROM "Balance" WHERE "userId" = ${fromId} FOR UPDATE
                `;

                if (!fromBalance || (Array.isArray(fromBalance) && fromBalance.length === 0)) {
                    throw new Error('Sender balance not found');
                }

                const balance = Array.isArray(fromBalance) ? fromBalance[0] : fromBalance;

                if (balance.amount < amount) {
                    throw new Error('Insufficient balance');
                }

                // Deduct from sender
                await tx.balance.update({
                    where: { userId: fromId },
                    data: { amount: { decrement: amount } }
                });

                // Get or create recipient balance
                let recipientBalance = await tx.balance.findUnique({
                    where: { userId: toUser.id }
                });

                if (!recipientBalance) {
                    recipientBalance = await tx.balance.create({
                        data: {
                            userId: toUser.id,
                            amount: amount,
                            locked: 0
                        }
                    });
                } else {
                    // Add to recipient
                    await tx.balance.update({
                        where: { userId: toUser.id },
                        data: { amount: { increment: amount } }
                    });
                }
            });

            return {
                success: true,
                message: "Money transferred successfully"
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Transaction failed";
            return {
                success: false,
                message: errorMessage
            }
        }
    } catch (error) {
        console.error("p2pTransfer error:", error);
        return {
            success: false,
            message: "Error while processing transfer"
        }
    }
}
