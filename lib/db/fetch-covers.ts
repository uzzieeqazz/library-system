import { Pool } from "pg";

const pool = new Pool({
    connectionString: "postgresql://postgres:1234@localhost:5432/library",
    ssl: false,
});

// Each entry: [bookId, searchTitle, searchAuthor]
const BOOK_SEARCH: [number, string, string][] = [
    [1, "Crime and Punishment", "Dostoevsky"],
    [2, "The Brothers Karamazov", "Dostoevsky"],
    [3, "War and Peace", "Tolstoy"],
    [4, "Anna Karenina", "Tolstoy"],
    [5, "One Hundred Years of Solitude", "Garcia Marquez"],
    [6, "Nineteen Eighty-Four", "George Orwell"],
    [7, "Animal Farm", "George Orwell"],
    [8, "The Metamorphosis", "Franz Kafka"],
    [9, "The Old Man and the Sea", "Ernest Hemingway"],
    [10, "The Stranger", "Albert Camus"],
    [11, "The Little Prince", "Antoine de Saint-Exupery"],
    [12, "Pride and Prejudice", "Jane Austen"],
    [13, "To Kill a Mockingbird", "Harper Lee"],
    [14, "The Idiot", "Dostoevsky"],
    [15, "The Myth of Sisyphus", "Albert Camus"],
    [16, "Sense and Sensibility", "Jane Austen"],
    [17, "Love in the Time of Cholera", "Garcia Marquez"],
    [18, "The Sun Also Rises", "Ernest Hemingway"],
    [19, "The Trial", "Franz Kafka"],
    [20, "A Moveable Feast", "Ernest Hemingway"],
];

async function fetchCoverId(title: string, author: string): Promise<string | null> {
    const q = encodeURIComponent(`${title} ${author}`);
    const url = `https://openlibrary.org/search.json?q=${q}&limit=5&fields=cover_i,title,author_name`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json() as { docs?: { cover_i?: number; title?: string }[] };
    const docs = data.docs ?? [];
    // Pick first result that has a cover
    const hit = docs.find(d => d.cover_i);
    if (!hit?.cover_i) return null;
    return `https://covers.openlibrary.org/b/id/${hit.cover_i}-L.jpg`;
}

async function run() {
    for (const [id, title, author] of BOOK_SEARCH) {
        process.stdout.write(`[${id}] "${title}" → `);
        const coverUrl = await fetchCoverId(title, author);
        if (coverUrl) {
            await pool.query("UPDATE books SET cover_url = $1 WHERE id = $2", [coverUrl, id]);
            console.log(coverUrl);
        } else {
            console.log("cover not found, skipping");
        }
        // Small delay to be polite to Open Library
        await new Promise(r => setTimeout(r, 300));
    }
    await pool.end();
    console.log("\nDone!");
}

run().catch(e => { console.error(e); process.exit(1); });
