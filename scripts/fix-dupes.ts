import { db } from "../lib/db/index";
import { sql } from "drizzle-orm";

async function fixDupes() {
    const dupes = await db.execute(sql`
        SELECT name_kz,
               MIN(id) AS keep_id,
               ARRAY_AGG(id ORDER BY id) AS all_ids
        FROM categories
        GROUP BY name_kz
        HAVING COUNT(*) > 1
    `);

    console.log(`Found ${dupes.rows.length} duplicate category names`);

    for (const row of dupes.rows as any[]) {
        const keepId = Number(row.keep_id);
        const dupeIds: number[] = (row.all_ids as number[])
            .map(Number)
            .filter(id => id !== keepId);

        console.log(`  "${row.name_kz}": keeping id=${keepId}, removing ids=${dupeIds}`);

        for (const dupeId of dupeIds) {
            // Reassign books
            await db.execute(sql`
                UPDATE books SET category_id = ${keepId} WHERE category_id = ${dupeId}
            `);
            // Delete duplicate category
            await db.execute(sql`
                DELETE FROM categories WHERE id = ${dupeId}
            `);
        }
    }

    const result = await db.execute(sql`SELECT id, name_kz FROM categories ORDER BY id`);
    console.log("\nCategories after cleanup:");
    for (const r of result.rows as any[]) {
        console.log(`  [${r.id}] ${r.name_kz}`);
    }

    process.exit(0);
}

fixDupes().catch(e => { console.error(e); process.exit(1); });
