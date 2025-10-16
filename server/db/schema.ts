// server/db/schema.ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parent_id: integer("parent_id"),
  sort: integer("sort").default(0),
  created_at: integer("created_at").notNull(),
  updated_at: integer("updated_at").notNull(),
});
