import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle", // drizzle的输出目录
  schema: "./server/db/schema", // 根据实际选择，如果把定义数据库的代码放在其它地方了，这里就要改成实际位置
  dialect: "sqlite", // cloudflare D1基于sqlite
});
