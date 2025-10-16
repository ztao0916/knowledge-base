import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { categories } from "../db/schema";

export default defineEventHandler(async (event) => {
  // hubDatabase() 返回的是 Cloudflare D1 的原生实例（类型为 D1Database），
  // 需要用 drizzle-orm 的 d1 适配器进行包装后，才能使用 .select()/.from() 等链式查询 API。
  const d1 = hubDatabase();
  const db = drizzle(d1);
  const q = getQuery(event);
  const { parent_id } = q;

  // 使用分支执行避免 TypeScript 类型推断问题
  const list = parent_id !== undefined
    ? await db.select().from(categories)
        .where(eq(categories.parent_id, Number(parent_id)))
        .orderBy(categories.sort)
        .all()
    : await db.select().from(categories)
        .orderBy(categories.sort)
        .all();

  return { data: list };
});
