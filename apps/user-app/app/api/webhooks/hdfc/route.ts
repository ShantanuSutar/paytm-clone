import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        // Validate required fields
        if (!body.token || !body.user_identifier || body.amount === undefined) {
            return NextResponse.json(
                {
                    message: "Missing required fields: token, user_identifier, amount"
                },
                { status: 400 }
            );
        }

        // Validate token format (should be a non-empty string)
        if (typeof body.token !== 'string' || body.token.trim().length === 0) {
            return NextResponse.json(
                {
                    message: "Invalid token: must be a non-empty string"
                },
                { status: 400 }
            );
        }

        const paymentInformation: {
            token: string;
            userId: string;
            amount: string
        } = {
            token: body.token,
            userId: body.user_identifier,
            amount: body.amount
        };

        // Validate amount is a positive number
        const amount = Number(paymentInformation.amount);
        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json(
                {
                    message: "Invalid amount: must be a positive number"
                },
                { status: 400 }
            );
        }

        // Validate userId is a valid number
        const userId = Number(paymentInformation.userId);
        if (isNaN(userId) || userId <= 0) {
            return NextResponse.json(
                {
                    message: "Invalid user_identifier: must be a positive number"
                },
                { status: 400 }
            );
        }

        // Check if user exists before updating balance
        const userExists = await db.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            return NextResponse.json(
                {
                    message: "User not found"
                },
                { status: 404 }
            );
        }

        // Check if transaction exists and is not already processed
        const existingTransaction = await db.onRampTransaction.findUnique({
            where: { token: paymentInformation.token }
        });

        if (!existingTransaction) {
            return NextResponse.json(
                {
                    message: "Transaction not found"
                },
                { status: 404 }
            );
        }

        if (existingTransaction.status === "Success") {
            return NextResponse.json(
                {
                    message: "Transaction already processed"
                },
                { status: 409 }
            );
        }

        // Validate userId matches the transaction's userId (prevent fraud)
        if (existingTransaction.userId !== userId) {
            return NextResponse.json(
                {
                    message: "User ID mismatch: webhook user does not match transaction user"
                },
                { status: 403 }
            );
        }

        // Validate amount matches the transaction amount (prevent amount fraud)
        if (existingTransaction.amount !== amount) {
            return NextResponse.json(
                {
                    message: "Amount mismatch: webhook amount does not match transaction amount"
                },
                { status: 400 }
            );
        }

        // Validate transaction status is Processing (can only complete processing transactions)
        if (existingTransaction.status !== "Processing") {
            return NextResponse.json(
                {
                    message: "Invalid transaction status: can only process 'Processing' transactions"
                },
                { status: 400 }
            );
        }

        // Atomic transaction: update balance and transaction status
        await db.$transaction([
            db.balance.upsert({
                where: {
                    userId: userId
                },
                update: {
                    amount: {
                        increment: amount
                    }
                },
                create: {
                    userId: userId,
                    amount: amount,
                    locked: 0
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        return NextResponse.json({
            message: "Captured"
        });
    } catch (e) {
        console.error("Webhook error:", e);
        return NextResponse.json(
            {
                message: "Error while processing webhook"
            },
            { status: 500 }
        );
    }
}
