import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const paymentInformation: {
            token: string;
            userId: string;
            amount: string
        } = {
            token: body.token,
            userId: body.user_identifier,
            amount: body.amount
        };

        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
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
