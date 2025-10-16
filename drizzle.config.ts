import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/schema.ts", // 你的 schema 文件路径
  out: "./drizzle/migrations", // 迁移 SQL 输出目录
  dialect: "sqlite", // D1 是基于 SQLite 的
  driver: "d1-http", // 或者 driver: 'sqlite' / 'd1' 视环境而定
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
