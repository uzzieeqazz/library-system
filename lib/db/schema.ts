import { pgTable, serial, text, integer, timestamp, pgEnum, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["reader", "admin"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "approved", "returned", "cancelled"]);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").default("reader").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const authors = pgTable("authors", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    bio: text("bio"),
});

export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    nameKz: text("name_kz").notNull(),
});

export const books = pgTable("books", {
    id: serial("id").primaryKey(),
    titleKz: text("title_kz").notNull(),
    authorId: integer("author_id").references(() => authors.id),
    categoryId: integer("category_id").references(() => categories.id),
    isbn: varchar("isbn", { length: 20 }),
    year: integer("year"),
    totalCopies: integer("total_copies").default(1).notNull(),
    availableCopies: integer("available_copies").default(1).notNull(),
    coverUrl: text("cover_url"),
    descriptionKz: text("description_kz"),
});

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
