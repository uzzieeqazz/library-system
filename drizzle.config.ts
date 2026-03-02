import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./lib/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        host: "localhost",
        port: 5432,
        database: "library",
        user: "postgres",
        password: "1234",
        ssl: false,
    },
});
