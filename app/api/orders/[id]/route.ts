import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, books } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    }

    const { id } = await params;
    const orderId = parseInt(id);
    const { status } = await req.json();

    const validStatuses = ["approved", "returned", "cancelled"];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Жарамсыз күй" }, { status: 400 });
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) return NextResponse.json({ error: "Тапсырыс табылмады" }, { status: 404 });

    if (status === "returned" && order.status !== "returned") {
        await db.update(books).set({ availableCopies: sql`${books.availableCopies} + 1` }).where(eq(books.id, order.bookId));
    }

    const [updated] = await db
        .update(orders)
        .set({ status, returnedAt: status === "returned" ? new Date() : undefined })
        .where(eq(orders.id, orderId))
        .returning();

    return NextResponse.json(updated);
}
