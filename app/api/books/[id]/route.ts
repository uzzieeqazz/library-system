import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { books, authors, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getMappedCoverUrl } from "@/lib/cover-mapper";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    if (isNaN(id)) return NextResponse.json({ error: "Жарамсыз ID" }, { status: 400 });

    const [row] = await db
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
            authorBio: authors.bio,
            categoryName: categories.nameKz,
            authorId: books.authorId,
            categoryId: books.categoryId,
        })
        .from(books)
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(categories, eq(books.categoryId, categories.id))
        .where(eq(books.id, id));

    if (!row) return NextResponse.json({ error: "Кітап табылмады" }, { status: 404 });
    
    // Map coverUrl dynamically to fix Vercel DB sync issues
    row.coverUrl = getMappedCoverUrl(row.titleKz, row.coverUrl);

    return NextResponse.json(row);
}
