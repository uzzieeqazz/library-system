import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authors } from "@/lib/db/schema";

export async function GET() {
    const rows = await db.select().from(authors).orderBy(authors.name);
    return NextResponse.json(rows);
}
