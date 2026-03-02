import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { books, authors, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function isAdmin(session: any) {
    return session?.user?.role === "admin";
}

// POST /api/admin/books — create a new book
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) {
        return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    }

    const body = await req.json();
    const {
        titleKz,
        authorName,
        authorBio,
        categoryId,
        year,
        isbn,
        coverUrl,
        descriptionKz,
        totalCopies = 1,
    } = body;

    if (!titleKz?.trim() || !authorName?.trim()) {
        return NextResponse.json({ error: "Кітап атауы мен автор міндетті" }, { status: 400 });
    }

    // Upsert author — find existing or create
    let [existingAuthor] = await db
        .select()
        .from(authors)
        .where(eq(authors.name, authorName.trim()));

    if (!existingAuthor) {
        [existingAuthor] = await db
            .insert(authors)
            .values({ name: authorName.trim(), bio: authorBio?.trim() || null })
            .returning();
    }

    const [newBook] = await db
        .insert(books)
        .values({
            titleKz: titleKz.trim(),
            authorId: existingAuthor.id,
            categoryId: categoryId ? parseInt(categoryId) : null,
            year: year ? parseInt(year) : null,
            isbn: isbn?.trim() || null,
            coverUrl: coverUrl?.trim() || null,
            descriptionKz: descriptionKz?.trim() || null,
            totalCopies: parseInt(totalCopies) || 1,
            availableCopies: parseInt(totalCopies) || 1,
        })
        .returning();

    return NextResponse.json(newBook, { status: 201 });
}

// DELETE /api/admin/books?id=X — delete a book
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) {
        return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    }

    const id = parseInt(new URL(req.url).searchParams.get("id") || "");
    if (isNaN(id)) return NextResponse.json({ error: "Жарамсыз ID" }, { status: 400 });

    await db.delete(books).where(eq(books.id, id));
    return NextResponse.json({ ok: true });
}
