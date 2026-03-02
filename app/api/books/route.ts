import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { books, authors, categories } from "@/lib/db/schema";
import { eq, ilike, and, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const categoryId = searchParams.get("category");
    const authorId = searchParams.get("author");
    const available = searchParams.get("available");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    const conditions = [];

    if (q) {
        conditions.push(ilike(books.titleKz, `%${q}%`));
    }
    if (categoryId) {
        conditions.push(eq(books.categoryId, parseInt(categoryId)));
    }
    if (authorId) {
        conditions.push(eq(books.authorId, parseInt(authorId)));
    }
    if (available === "true") {
        conditions.push(sql`${books.availableCopies} > 0`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
        .select({
            id: books.id,
            titleKz: books.titleKz,
            isbn: books.isbn,
            year: books.year,
            availableCopies: books.availableCopies,
            totalCopies: books.totalCopies,
            coverUrl: books.coverUrl,
            descriptionKz: books.descriptionKz,
            authorName: authors.name,
            categoryName: categories.nameKz,
            authorId: books.authorId,
            categoryId: books.categoryId,
        })
        .from(books)
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(categories, eq(books.categoryId, categories.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset);

    const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(books)
        .where(whereClause);

    return NextResponse.json({ books: rows, total: Number(count), page, limit });
}
