/**
 * seed.ts
 *
 * Populates the database using books.data.ts as the catalog config.
 * For each book, fetches live from Open Library:
 *   - Canonical year of first publication
 *   - ISBN (first available edition)
 *   - Cover image URL (via cover_i cover ID)
 *
 * Kazakh-specific fields (titleKz, descriptionKz) come from books.data.ts.
 *
 * Run: npm run db:seed
 */

import { db } from "./index";
import { authors, categories, books, users } from "./schema";
import { CATALOG, CATEGORIES } from "./books.data";
import bcrypt from "bcryptjs";

// ── Open Library helpers ─────────────────────────────────────────────────────

interface OLSearchResult {
    title?: string;
    first_publish_year?: number;
    isbn?: string[];
    cover_i?: number;
}

interface OLSearchResponse {
    docs?: OLSearchResult[];
}

async function fetchOLData(
    title: string,
    author: string
): Promise<{ year: number | null; isbn: string | null; coverUrl: string | null }> {
    const q = encodeURIComponent(`${title} ${author}`);
    const url = `https://openlibrary.org/search.json?q=${q}&limit=5&fields=first_publish_year,isbn,cover_i,title`;

    try {
        const res = await fetch(url, {
            headers: { "User-Agent": "LibrarySystem/1.0 (educational project)" },
        });
        if (!res.ok) return { year: null, isbn: null, coverUrl: null };

        const data = (await res.json()) as OLSearchResponse;
        const docs = data.docs ?? [];

        // Pick the first result that has a cover
        const hit = docs.find((d) => d.cover_i) ?? docs[0];
        if (!hit) return { year: null, isbn: null, coverUrl: null };

        return {
            year: hit.first_publish_year ?? null,
            isbn: hit.isbn?.[0] ?? null,
            coverUrl: hit.cover_i
                ? `https://covers.openlibrary.org/b/id/${hit.cover_i}-L.jpg`
                : null,
        };
    } catch {
        return { year: null, isbn: null, coverUrl: null };
    }
}

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
    console.log("Бастапқы деректер енгізілуде...\n");

    // 1. Categories
    const insertedCats = await db
        .insert(categories)
        .values(CATEGORIES.map((name) => ({ nameKz: name })))
        .returning();

    const catByName = Object.fromEntries(
        insertedCats.map((c) => [c.nameKz, c.id])
    );

    // 2. Deduplicate authors from catalog
    const uniqueAuthors = [
        ...new Map(
            CATALOG.map((b) => [b.authorName, { name: b.authorName, bio: b.authorBio }])
        ).values(),
    ];

    const insertedAuthors = await db
        .insert(authors)
        .values(uniqueAuthors)
        .returning();

    const authorByName = Object.fromEntries(
        insertedAuthors.map((a) => [a.name, a.id])
    );

    // 3. Fetch OL data + insert books
    for (const entry of CATALOG) {
        const { title, author } = entry.olSearch;
        process.stdout.write(`  Іздеу: "${title}" (${author})... `);

        const { year, isbn, coverUrl } = await fetchOLData(title, author);
        console.log(year ? `${year} ✓` : "жыл табылмады");

        await db.insert(books).values({
            titleKz: entry.titleKz,
            authorId: authorByName[entry.authorName],
            categoryId: catByName[entry.category],
            isbn: isbn ?? undefined,
            year: year ?? undefined,
            totalCopies: entry.totalCopies,
            availableCopies: entry.totalCopies,
            coverUrl: coverUrl ?? undefined,
            descriptionKz: entry.descriptionKz,
        });

        // Polite delay to respect Open Library rate limits
        await new Promise((r) => setTimeout(r, 350));
    }

    // 4. Default users
    const adminHash = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
        name: "Кітапхана Әкімшісі",
        email: "admin@library.kz",
        passwordHash: adminHash,
        role: "admin",
    });

    const readerHash = await bcrypt.hash("reader123", 10);
    await db.insert(users).values({
        name: "Тест Оқырман",
        email: "reader@library.kz",
        passwordHash: readerHash,
        role: "reader",
    });

    console.log("\nДеректер сәтті енгізілді!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Қате:", err);
    process.exit(1);
});
