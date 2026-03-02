import { Pool } from "pg";

const pool = new Pool({
    connectionString: "postgresql://postgres:1234@localhost:5432/library",
    ssl: false,
});

// Open Library cover images (large size)
// Format: https://covers.openlibrary.org/b/isbn/<ISBN>-L.jpg
const covers: [number, string][] = [
    [1, "https://covers.openlibrary.org/b/isbn/9780140287301-L.jpg"],  // Crime and Punishment
    [2, "https://covers.openlibrary.org/b/isbn/9780374528379-L.jpg"],  // Brothers Karamazov
    [3, "https://covers.openlibrary.org/b/isbn/9780199232765-L.jpg"],  // War and Peace
    [4, "https://covers.openlibrary.org/b/isbn/9780140442328-L.jpg"],  // Anna Karenina
    [5, "https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg"],  // 100 Years of Solitude
    [6, "https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg"],  // 1984
    [7, "https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg"],  // Animal Farm
    [8, "https://covers.openlibrary.org/b/isbn/9780679720201-L.jpg"],  // The Metamorphosis
    [9, "https://covers.openlibrary.org/b/isbn/9780684830490-L.jpg"],  // The Old Man and the Sea
    [10, "https://covers.openlibrary.org/b/isbn/9780679720209-L.jpg"],  // The Stranger
    [11, "https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg"],  // The Little Prince
    [12, "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg"],  // Pride and Prejudice
    [13, "https://covers.openlibrary.org/b/isbn/9780060935467-L.jpg"],  // To Kill a Mockingbird
    [14, "https://covers.openlibrary.org/b/isbn/9780140447927-L.jpg"],  // The Idiot
    [15, "https://covers.openlibrary.org/b/isbn/9780060904418-L.jpg"],  // The Myth of Sisyphus
    [16, "https://covers.openlibrary.org/b/isbn/9780140435916-L.jpg"],  // Sense and Sensibility
    [17, "https://covers.openlibrary.org/b/isbn/9780060882983-L.jpg"],  // Love in the Time of Cholera
    [18, "https://covers.openlibrary.org/b/isbn/9780684844947-L.jpg"],  // The Sun Also Rises
    [19, "https://covers.openlibrary.org/b/isbn/9780805207880-L.jpg"],  // The Trial
    [20, "https://covers.openlibrary.org/b/isbn/9780684830483-L.jpg"],  // A Moveable Feast
];

async function run() {
    for (const [id, url] of covers) {
        await pool.query("UPDATE books SET cover_url = $1 WHERE id = $2", [url, id]);
        console.log(`Book ${id} → ${url}`);
    }
    await pool.end();
    console.log("Done!");
}

run().catch((e) => { console.error(e); process.exit(1); });
