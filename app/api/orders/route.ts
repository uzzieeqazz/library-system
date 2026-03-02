import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, books, authors, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const orderSchema = z.object({
    bookId: z.number(),
    dueDate: z.string().optional(),
});

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 401 });

    const userId = parseInt((session.user as any).id);
    const isAdmin = (session.user as any).role === "admin";

    const rows = await db
        .select({
            id: orders.id,
            userId: orders.userId,
            bookId: orders.bookId,
            status: orders.status,
            orderedAt: orders.orderedAt,
            dueDate: orders.dueDate,
            returnedAt: orders.returnedAt,
            bookTitle: books.titleKz,
            authorName: authors.name,
            userName: users.name,
        })
        .from(orders)
        .leftJoin(books, eq(orders.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(users, eq(orders.userId, users.id))
        .where(isAdmin ? undefined : eq(orders.userId, userId))
        .orderBy(sql`${orders.orderedAt} DESC`);

    // Reshape for frontend compatibility
    const shaped = rows.map((r) => ({
        ...r,
        book: {
            titleKz: r.bookTitle,
            author: { name: r.authorName },
        },
        user: { name: r.userName },
    }));

    return NextResponse.json(shaped);
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 401 });

    const userId = parseInt((session.user as any).id);

    try {
        const body = await req.json();
        const { bookId, dueDate } = orderSchema.parse(body);

        const [book] = await db.select().from(books).where(eq(books.id, bookId));
        if (!book) return NextResponse.json({ error: "Кітап табылмады" }, { status: 404 });
        if (book.availableCopies <= 0) return NextResponse.json({ error: "Бос данасы жоқ" }, { status: 400 });

        await db.update(books).set({ availableCopies: sql`${books.availableCopies} - 1` }).where(eq(books.id, bookId));

        const dueDateValue = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        const [order] = await db.insert(orders).values({ userId, bookId, dueDate: dueDateValue }).returning();

        return NextResponse.json(order, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: "Тапсырыс беру мүмкін болмады" }, { status: 400 });
    }
}
