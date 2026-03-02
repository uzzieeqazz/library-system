import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";

export async function GET() {
    const rows = await db.select().from(categories).orderBy(categories.id);
    return NextResponse.json(rows);
}
