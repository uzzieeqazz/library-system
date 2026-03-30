/**
 * seed.ts
 *
 * Populates the database using books.data.ts as the catalog config.
 * For each book, fetches live from Open Library:
 *   - Canonical year of first publication
 *   - ISBN (first available edition)
 * 
 * Image covers are sourced from Unsplash for high performance instead of OpenLibrary
 *
 * Run: npm run db:seed
 */

import { db } from "./index";
import { authors, categories, books, users } from "./schema";
import { CATALOG, CATEGORIES } from "./books.data";
import bcrypt from "bcryptjs";

// ── Open Library helpers & High Quality Unsplash Covers ─────────────────────

const FAST_COVERS = [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511108690759-009324a90311?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507738978512-35798112892c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1629196914275-cd2ea6eb2430?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=800&auto=format&fit=crop"
];

interface OLSearchResult {
    title?: string;
    first_publish_year?: number;
    isbn?: string[];
}

interface OLSearchResponse {
    docs?: OLSearchResult[];
}

async function fetchOLData(
    title: string,
    author: string,
    index: number
): Promise<{ year: number | null; isbn: string | null; coverUrl: string }> {
    const q = encodeURIComponent(`${title} ${author}`);
    const url = `https://openlibrary.org/search.json?q=${q}&limit=5&fields=first_publish_year,isbn,title`;
    
    // Select an Unsplash cover deterministically based on book index
    const coverUrl = FAST_COVERS[index % FAST_COVERS.length];

    try {
        const res = await fetch(url, {
            headers: { "User-Agent": "LibrarySystem/1.0" },
        });
        if (!res.ok) return { year: null, isbn: null, coverUrl };

        const data = (await res.json()) as OLSearchResponse;
        const hit = data.docs?.[0]; // take top result for metadata
        
        if (!hit) return { year: null, isbn: null, coverUrl };

        return {
            year: hit.first_publish_year ?? null,
            isbn: hit.isbn?.[0] ?? null,
            coverUrl: coverUrl,
        };
    } catch {
        return { year: null, isbn: null, coverUrl };
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
    for (let i = 0; i < CATALOG.length; i++) {
        const entry = CATALOG[i];
        const { title, author } = entry.olSearch;
        process.stdout.write(`  Іздеу: "${title}" (${author})... `);

        const { year, isbn, coverUrl } = await fetchOLData(title, author, i);
        console.log(year ? `${year} ✓` : "мәлімет табылмады (бірақ сурет қойылды ✓)");

        await db.insert(books).values({
            titleKz: entry.titleKz,
            authorId: authorByName[entry.authorName],
            categoryId: catByName[entry.category],
            isbn: isbn ?? undefined,
            year: year ?? undefined,
            totalCopies: entry.totalCopies,
            availableCopies: entry.totalCopies,
            coverUrl: coverUrl,
            descriptionKz: entry.descriptionKz,
        });

        // Polite delay to respect Open Library rate limits
        await new Promise((r) => setTimeout(r, 200));
    }

    // 4. Default users
    const adminHash = await bcrypt.hash("admin123", 10);
    const existingAdmin = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, "admin@library.kz") });
    if (!existingAdmin) {
        await db.insert(users).values({
            name: "Кітапхана Әкімшісі",
            email: "admin@library.kz",
            passwordHash: adminHash,
            role: "admin",
        });
    }

    const readerHash = await bcrypt.hash("reader123", 10);
    const existingReader = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, "reader@library.kz") });
    if (!existingReader) {
        await db.insert(users).values({
            name: "Тест Оқырман",
            email: "reader@library.kz",
            passwordHash: readerHash,
            role: "reader",
        });
    }

    console.log("\nДеректер сәтті енгізілді!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Қате:", err);
    process.exit(1);
});
