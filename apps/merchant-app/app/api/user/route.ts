import { NextResponse } from "next/server"
import prisma from "@repo/db/client";

export const GET = async () => {
    // This is a test endpoint - creates a merchant
    await prisma.merchant.create({
        data: {
            email: "test@example.com",
            name: "Test Merchant",
            auth_type: "Google"
        }
    })
    return NextResponse.json({
        message: "Merchant created"
    })
}