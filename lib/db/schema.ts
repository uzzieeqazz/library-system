import { pgTable, serial, text, integer, timestamp, pgEnum, varchar } from "drizzle-orm/pg-core";

/**
 * Рөл enums:
 * - reader: кәдімгі оқырман (кітап тапсырысы бере алады)
 * - admin: жүйе әкімшісі (кітап қосу/жою, тапсырыстарды басқару)
 */
export const roleEnum = pgEnum("role", ["reader", "admin"]);

/**
 * Тапсырыс күйлері:
 * - pending: күтілуде (жаңа тапсырыс)
 * - approved: бекітілді (кітапты алуға болады)
 * - returned: қайтарылды
 * - cancelled: бас тартылды
 */
export const orderStatusEnum = pgEnum("order_status", ["pending", "approved", "returned", "cancelled"]);

/** Жүйе пайдаланушылары */
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").default("reader").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Кітап авторлары */
export const authors = pgTable("authors", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    bio: text("bio"),
});

/** Кітап санаттары (жанрлары) */
export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    nameKz: text("name_kz").notNull(),
});

/** Кітаптар — негізгі кесте */
export const books = pgTable("books", {
    id: serial("id").primaryKey(),
    titleKz: text("title_kz").notNull(),
    authorId: integer("author_id").references(() => authors.id),
    categoryId: integer("category_id").references(() => categories.id),
    isbn: varchar("isbn", { length: 20 }),
    year: integer("year"),
    totalCopies: integer("total_copies").default(1).notNull(),
    /** Қолжетімді бос даналар саны (тапсырыс берілгенде азаяды) */
    availableCopies: integer("available_copies").default(1).notNull(),
    coverUrl: text("cover_url"),
    descriptionKz: text("description_kz"),
});

/** Пайдаланушылардың кітап тапсырыстары */
export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    bookId: integer("book_id").references(() => books.id).notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),
    orderedAt: timestamp("ordered_at").defaultNow().notNull(),
    dueDate: timestamp("due_date"),
    returnedAt: timestamp("returned_at"),
});

export type User = typeof users.$inferSelect;
export type Author = typeof authors.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Book = typeof books.$inferSelect;
export type Order = typeof orders.$inferSelect;

