# Nuxt4 + Cloudflare D1 数据库集成

## 场景描述

在 Nuxt4 项目中集成 Cloudflare D1 数据库，使用 Drizzle ORM 进行数据库操作，实现完整的数据库连接和 API 接口开发。

## 解决方案

### 1. 环境准备

#### 安装 Wrangler CLI

```bash
pnpm add -D wrangler
```

#### 登录 Cloudflare 账号

```bash
pnpx wrangler login
```

### 2. D1 数据库配置

#### 创建 D1 数据库

```bash
# 创建新数据库
pnpx wrangler d1 create 数据库名

# 查看已有数据库
pnpx wrangler d1 list
```

#### 配置 wrangler.toml

在项目根目录创建 `wrangler.toml` 文件：

```toml
[[d1_databases]]
binding = "DB"
database_name = "your_database_name"
database_id = "your_database_id"
migrations_dir = "drizzle"
```

### 3. Nuxt4 配置

#### 安装 Cloudflare 开发插件

```bash
pnpm add -D nitro-cloudflare-dev
```

#### 配置 nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: ["nitro-cloudflare-dev"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
});
```

### 4. Drizzle ORM 集成

#### 安装 Drizzle

```bash
pnpm add drizzle-kit drizzle-orm
```

#### 配置 drizzle.config.ts

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle", // drizzle的输出目录
  schema: "./server/db/schema", // 数据库模式定义位置
  dialect: "sqlite", // cloudflare D1基于sqlite
});
```

#### 定义数据库模式

在 `server/db/schema/user.ts` 中定义表结构：

```typescript
import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  UserId: int().primaryKey({ autoIncrement: true }),
  UserName: text().notNull(),
  UserEmail: text().notNull().unique(),
  UserPassword: text().notNull(),
  CreatedAt: text().default(sql`CURRENT_TIMESTAMP`),
});
```

#### 生成迁移文件

```bash
npx drizzle-kit generate
```

#### 应用迁移到本地数据库

```bash
pnpx wrangler d1 migrations apply 数据库名 --local
```

### 5. 中间件配置

在 `server/middleware/d1.ts` 中配置数据库中间件：

```typescript
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { usersTable } from "~/server/db/schema/user";

const schema = {
  usersTable,
};

declare module "h3" {
  interface H3EventContext {
    db: DrizzleD1Database<typeof schema>;
  }
}

let cloudflare: DrizzleD1Database<typeof schema> | undefined;

export default defineEventHandler(async ({ context }) => {
  cloudflare = context.cloudflare || cloudflare;
  // 这里的 DB 对应 wrangler.toml 中的 binding 设置
  const { DB } = (context.cloudflare || cloudflare).env;
  context.db = drizzle(DB, { schema });
});
```

### 6. API 接口实现

在 `server/api/hello.ts` 中实现数据库查询：

```typescript
import { usersTable } from "~/server/db/schema/user";

export default defineEventHandler(async (event) => {
  try {
    const { db } = event.context;
    const user = await db
      .select({
        id: usersTable.UserId,
        name: usersTable.UserName,
        email: usersTable.UserEmail,
        createdAt: usersTable.CreatedAt,
      })
      .from(usersTable)
      .all();

    // 设置响应头避免报错
    setResponseHeaders(event, {
      Connection: "close",
      "Content-Type": "application/json",
    });

    return user;
  } catch (error) {
    console.error("数据库查询错误:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "服务器内部错误",
      message: "获取用户数据时发生错误",
    });
  }
});
```

## 相关文档

- [Drizzle + Cloudflare D1 集成指南](https://orm.drizzle.team/docs/connect-cloudflare-d1)
- [参考教程](https://www.w4ter.com/posts/2025/4/8/install_nuxt)

## 注意事项

### 开发环境

- 本地开发时会生成 `.wrangler` 文件夹，包含本地 SQLite 数据库
- 可以使用 SQLite 查看器查看本地数据库内容
- 需要先运行迁移命令初始化本地数据库

### 生产环境

- 确保 Cloudflare 账号中已创建对应的 D1 数据库
- 部署时需要配置正确的数据库 ID 和绑定名称
- 生产环境的迁移需要去掉 `--local` 参数

### 常见问题

- 如果 `pnpx drizzle-kit generate` 报错，尝试使用 `npx drizzle-kit generate`
- 响应头设置问题：某些情况下需要手动设置 `Connection: close` 和 `Content-Type`
- 确保 `wrangler.toml` 中的 `binding` 名称与中间件中使用的名称一致

### 性能优化

- 使用 Drizzle 的查询构建器可以获得更好的类型安全
- 合理使用索引和查询优化
- 考虑使用连接池和缓存策略
