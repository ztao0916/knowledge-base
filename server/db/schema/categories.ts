import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 分类表
export const categoriesTable = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(), // 分类名称，如"社交媒体"
  icon: text().notNull(), // 图标，如"📱"
  slug: text().notNull().unique(), // URL友好的标识符，如"social"
  sortOrder: int().notNull().default(0), // 排序字段
  isActive: int().notNull().default(1), // 是否启用 (1=启用, 0=禁用)
  createdAt: text().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text().default(sql`CURRENT_TIMESTAMP`),
});

// 链接表
export const linksTable = sqliteTable("links", {
  id: int().primaryKey({ autoIncrement: true }),
  categoryId: int().notNull().references(() => categoriesTable.id, { onDelete: 'cascade' }), // 外键关联分类
  name: text().notNull(), // 链接名称，如"微博"
  url: text().notNull(), // 链接地址
  description: text(), // 可选的描述信息
  sortOrder: int().notNull().default(0), // 排序字段
  isActive: int().notNull().default(1), // 是否启用
  createdAt: text().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text().default(sql`CURRENT_TIMESTAMP`),
});

// 导出类型定义
export type Category = typeof categoriesTable.$inferSelect;
export type NewCategory = typeof categoriesTable.$inferInsert;
export type Link = typeof linksTable.$inferSelect;
export type NewLink = typeof linksTable.$inferInsert;

// 带链接的分类类型（用于API返回）
export type CategoryWithLinks = Category & {
  links: Link[];
};