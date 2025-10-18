import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  UserId: int().primaryKey({ autoIncrement: true }),
  UserName: text().notNull(),
  UserEmail: text().notNull().unique(),
  UserPassword: text().notNull(),
  CreatedAt: text().default(sql`CURRENT_TIMESTAMP`),
});
