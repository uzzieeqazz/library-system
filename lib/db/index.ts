import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "library",
    user: "postgres",
    password: "1234",
    ssl: false,
});

export const db = drizzle(pool, { schema });
