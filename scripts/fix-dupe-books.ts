import { db } from "../lib/db/index";
import { sql } from "drizzle-orm";

async function fixDupeBooks() {
    // Find duplicate books by title
    const dupes = await db.execute(sql`
        SELECT title_kz,
               MIN(id) AS keep_id,
               ARRAY_AGG(id ORDER BY id) AS all_ids
        FROM books
        GROUP BY title_kz
        HAVING COUNT(*) > 1
    `);

    console.log(`Found ${dupes.rows.length} duplicate book titles`);

    for (const row of dupes.rows as any[]) {
        const keepId = Number(row.keep_id);
        const dupeIds: number[] = (row.all_ids as number[])
            .map(Number)
            .filter(id => id !== keepId);

        console.log(`  "${row.title_kz}": keeping id=${keepId}, removing ids=${dupeIds}`);

        for (const dupeId of dupeIds) {
            // Reassign any orders referencing the dupe book
            await db.execute(sql`
                UPDATE orders SET book_id = ${keepId} WHERE book_id = ${dupeId}
            `);
            // Delete duplicate book
            await db.execute(sql`
                DELETE FROM books WHERE id = ${dupeId}
            `);
        }
    }

    const result = await db.execute(sql`SELECT COUNT(*) as cnt FROM books`);
    console.log(`\nBooks after cleanup: ${(result.rows[0] as any).cnt}`);

    process.exit(0);
}

fixDupeBooks().catch(e => { console.error(e); process.exit(1); });
