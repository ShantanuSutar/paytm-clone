import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { phoneNumber, amount } = body;

        // Validation
        if (!phoneNumber || !amount) {
            return NextResponse.json(
                { message: "Phone number and amount are required" },
                { status: 400 }
            );
        }

        if (!/^\d{10}$/.test(phoneNumber)) {
            return NextResponse.json(
                { message: "Invalid phone number format" },
                { status: 400 }
            );
        }

        const amountNum = Number(amount);
        if (isNaN(amountNum) || amountNum <= 0 || !Number.isInteger(amountNum)) {
            return NextResponse.json(
                { message: "Invalid amount" },
                { status: 400 }
            );
        }

        const senderUserId = parseInt(session.user.id);

        // Find recipient by phone number
        const recipient = await db.user.findUnique({
            where: { number: phoneNumber }
        });

        if (!recipient) {
            return NextResponse.json(
                { message: "Recipient not found" },
                { status: 404 }
            );
        }

        // Prevent self-transfers
        if (recipient.id === senderUserId) {
            return NextResponse.json(
                { message: "Cannot send money to yourself" },
                { status: 400 }
            );
        }

        // Get sender's balance
        const senderBalance = await db.balance.findUnique({
            where: { userId: senderUserId }
        });

        if (!senderBalance || senderBalance.amount < amountNum) {
            return NextResponse.json(
                { message: "Insufficient balance" },
                { status: 400 }
            );
        }

        // Get recipient's balance (create if doesn't exist)
        let recipientBalance = await db.balance.findUnique({
            where: { userId: recipient.id }
        });

        if (!recipientBalance) {
            recipientBalance = await db.balance.create({
                data: {
                    userId: recipient.id,
                    amount: 0,
                    locked: 0
                }
            });
        }

        // Perform atomic transaction with row locking
        await db.$transaction(async (tx) => {
            // Lock sender's balance FOR UPDATE to prevent race conditions
            const senderBalanceLocked = await tx.$queryRaw`
                SELECT * FROM "Balance" WHERE "userId" = ${senderUserId} FOR UPDATE
            `;

            if (!senderBalanceLocked || (Array.isArray(senderBalanceLocked) && senderBalanceLocked.length === 0)) {
                throw new Error('Sender balance not found');
            }

            const lockedBalance = Array.isArray(senderBalanceLocked) ? senderBalanceLocked[0] : senderBalanceLocked;

            // Re-check balance after locking (double-check pattern)
            if (lockedBalance.amount < amountNum) {
                throw new Error('Insufficient balance');
            }

            // Deduct from sender
            await tx.balance.update({
                where: { userId: senderUserId },
                data: {
                    amount: {
                        decrement: amountNum
                    }
                }
            });

            // Add to recipient
            await tx.balance.update({
                where: { userId: recipient.id },
                data: {
                    amount: {
                        increment: amountNum
                    }
                }
            });
        });

        return NextResponse.json(
            { message: `Successfully sent ₹${(amountNum / 100).toFixed(2)} to ${phoneNumber}` },
            { status: 200 }
        );
    } catch (e) {
        console.error("Transfer error:", e);
        return NextResponse.json(
            { message: "Error processing transfer" },
            { status: 500 }
        );
    }
}
