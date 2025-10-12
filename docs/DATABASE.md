# 九贰零玖要录 数据库设计文档

## 数据库概览

九贰零玖要录 使用 Cloudflare D1 作为主要数据库，这是一个基于 SQLite 的分布式 SQL 数据库，运行在 Cloudflare 的边缘网络上。数据库设计遵循关系型数据库的最佳实践，确保数据一致性、性能和可扩展性。

### 技术特性

- **SQLite 兼容**: 支持标准 SQL 语法和功能
- **边缘分布**: 数据在全球边缘节点复制
- **ACID 事务**: 保证数据一致性
- **自动备份**: 内置数据备份和恢复机制
- **零配置**: 无需手动管理数据库服务器

## 数据库架构

### 整体 ERD 图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   categories    │    │ navigation_items│    │  search_engines │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄──┐│ id (PK)         │    │ id (PK)         │
│ name            │   └│ category_id (FK)│    │ name            │
│ slug            │    │ title           │    │ url             │
│ description     │    │ url             │    │ icon            │
│ icon            │    │ description     │    │ placeholder     │
│ color           │    │ icon            │    │ is_active       │
│ sort_order      │    │ sort_order      │    │ sort_order      │
│ is_active       │    │ is_active       │    │ created_at      │
│ created_at      │    │ created_at      │    │ updated_at      │
│ updated_at      │    │ updated_at      │    └─────────────────┘
└─────────────────┘    └─────────────────┘
                                │
                                │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   site_config   │    │  calendar_data  │    │   user_stats    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ key             │    │ date            │    │ item_id (FK)    │
│ value           │    │ type            │    │ click_count     │
│ description     │    │ content         │    │ last_clicked    │
│ is_public       │    │ is_auspicious   │    │ created_at      │
│ created_at      │    │ created_at      │    │ updated_at      │
│ updated_at      │    │ updated_at      │    └─────────────────┘
└─────────────────┘    └─────────────────┘
```

## 数据表设计

### 1. categories (分类表)

存储导航网站的分类信息。

```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3b82f6',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active_sort ON categories(is_active, sort_order);
CREATE INDEX idx_categories_updated ON categories(updated_at);
```

#### 字段说明

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | INTEGER | 主键，自增 | PRIMARY KEY |
| name | TEXT | 分类名称 | NOT NULL, UNIQUE |
| slug | TEXT | URL 友好的标识符 | NOT NULL, UNIQUE |
| description | TEXT | 分类描述 | 可选 |
| icon | TEXT | 图标名称或 URL | 可选 |
| color | TEXT | 主题色，十六进制 | 默认蓝色 |
| sort_order | INTEGER | 排序权重 | 默认 0 |
| is_active | BOOLEAN | 是否启用 | 默认 true |
| created_at | DATETIME | 创建时间 | 自动设置 |
| updated_at | DATETIME | 更新时间 | 自动设置 |

#### 示例数据

```sql
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('开发工具', 'dev-tools', '编程开发相关工具和资源', 'i-heroicons-code-bracket', '#10b981', 1),
('设计资源', 'design', '设计工具和素材资源', 'i-heroicons-paint-brush', '#f59e0b', 2),
('学习教育', 'education', '在线学习和教育平台', 'i-heroicons-academic-cap', '#8b5cf6', 3),
('生活服务', 'lifestyle', '日常生活服务网站', 'i-heroicons-home', '#ef4444', 4);
```

### 2. navigation_items (导航项表)

存储具体的导航网站信息。

```sql
CREATE TABLE navigation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    click_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_navigation_category ON navigation_items(category_id);
CREATE INDEX idx_navigation_active_sort ON navigation_items(is_active, sort_order);
CREATE INDEX idx_navigation_url ON navigation_items(url);
CREATE INDEX idx_navigation_updated ON navigation_items(updated_at);
CREATE INDEX idx_navigation_clicks ON navigation_items(click_count DESC);
```

#### 字段说明

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | INTEGER | 主键，自增 | PRIMARY KEY |
| category_id | INTEGER | 所属分类 ID | NOT NULL, FK |
| title | TEXT | 网站标题 | NOT NULL |
| url | TEXT | 网站 URL | NOT NULL |
| description | TEXT | 网站描述 | 可选 |
| icon | TEXT | 网站图标 URL | 可选 |
| sort_order | INTEGER | 排序权重 | 默认 0 |
| is_active | BOOLEAN | 是否启用 | 默认 true |
| click_count | INTEGER | 点击统计 | 默认 0 |
| created_at | DATETIME | 创建时间 | 自动设置 |
| updated_at | DATETIME | 更新时间 | 自动设置 |

#### 示例数据

```sql
INSERT INTO navigation_items (category_id, title, url, description, sort_order) VALUES
(1, 'GitHub', 'https://github.com', '全球最大的代码托管平台', 1),
(1, 'Stack Overflow', 'https://stackoverflow.com', '程序员问答社区', 2),
(1, 'MDN Web Docs', 'https://developer.mozilla.org', 'Web 开发权威文档', 3),
(2, 'Figma', 'https://figma.com', '协作式界面设计工具', 1),
(2, 'Dribbble', 'https://dribbble.com', '设计师作品展示平台', 2);
```

### 3. search_engines (搜索引擎表)

存储搜索引擎配置信息。

```sql
CREATE TABLE search_engines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    icon TEXT,
    placeholder TEXT DEFAULT '搜索...',
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_search_engines_active_sort ON search_engines(is_active, sort_order);
CREATE INDEX idx_search_engines_name ON search_engines(name);
```

#### 字段说明

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | INTEGER | 主键，自增 | PRIMARY KEY |
| name | TEXT | 搜索引擎名称 | NOT NULL, UNIQUE |
| url | TEXT | 搜索 URL 模板 | NOT NULL |
| icon | TEXT | 搜索引擎图标 | 可选 |
| placeholder | TEXT | 搜索框占位符 | 默认"搜索..." |
| is_active | BOOLEAN | 是否启用 | 默认 true |
| sort_order | INTEGER | 排序权重 | 默认 0 |
| created_at | DATETIME | 创建时间 | 自动设置 |
| updated_at | DATETIME | 更新时间 | 自动设置 |

#### 示例数据

```sql
INSERT INTO search_engines (name, url, icon, placeholder, sort_order) VALUES
('百度', 'https://www.baidu.com/s?wd={query}', 'https://www.baidu.com/favicon.ico', '百度一下', 1),
('Google', 'https://www.google.com/search?q={query}', 'https://www.google.com/favicon.ico', 'Search Google', 2),
('必应', 'https://www.bing.com/search?q={query}', 'https://www.bing.com/favicon.ico', '必应搜索', 3),
('GitHub', 'https://github.com/search?q={query}', 'https://github.com/favicon.ico', '搜索代码', 4);
```

### 4. site_config (站点配置表)

存储网站的全局配置信息。

```sql
CREATE TABLE site_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_site_config_key ON site_config(key);
CREATE INDEX idx_site_config_public ON site_config(is_public);
```

#### 字段说明

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | INTEGER | 主键，自增 | PRIMARY KEY |
| key | TEXT | 配置键名 | NOT NULL, UNIQUE |
| value | TEXT | 配置值 | NOT NULL |
| description | TEXT | 配置描述 | 可选 |
| is_public | BOOLEAN | 是否公开 | 默认 false |
| created_at | DATETIME | 创建时间 | 自动设置 |
| updated_at | DATETIME | 更新时间 | 自动设置 |

#### 示例数据

```sql
INSERT INTO site_config (key, value, description, is_public) VALUES
('site_title', '九贰零玖要录 - 个人导航网站', '网站标题', 1),
('site_description', '简洁高效的个人导航网站，收录优质网站资源', '网站描述', 1),
('site_keywords', '九贰零玖要录,导航,网站导航,个人导航', '网站关键词', 1),
('site_logo', '/logo.svg', '网站 Logo', 1),
('theme_color', '#3b82f6', '主题色', 1),
('enable_analytics', 'true', '是否启用统计', 0),
('max_items_per_category', '20', '每个分类最大项目数', 0);
```

### 5. calendar_data (日历数据表)

存储日历相关的数据，如节日、宜忌等信息。

```sql
CREATE TABLE calendar_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    type TEXT NOT NULL, -- 'holiday', 'solar_term', 'custom'
    content TEXT NOT NULL,
    is_auspicious BOOLEAN DEFAULT NULL, -- NULL: 中性, 1: 吉, 0: 凶
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_calendar_date ON calendar_data(date);
CREATE INDEX idx_calendar_type ON calendar_data(type);
CREATE INDEX idx_calendar_date_type ON calendar_data(date, type);
```

#### 字段说明

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | INTEGER | 主键，自增 | PRIMARY KEY |
| date | DATE | 日期 | NOT NULL |
| type | TEXT | 数据类型 | NOT NULL |
| content | TEXT | 内容描述 | NOT NULL |
| is_auspicious | BOOLEAN | 吉凶属性 | 可选 |
| created_at | DATETIME | 创建时间 | 自动设置 |
| updated_at | DATETIME | 更新时间 | 自动设置 |

#### 示例数据

```sql
INSERT INTO calendar_data (date, type, content, is_auspicious) VALUES
('2024-01-01', 'holiday', '元旦', 1),
('2024-02-10', 'holiday', '春节', 1),
('2024-02-04', 'solar_term', '立春', NULL),
('2024-01-15', 'custom', '宜：开业 忌：搬家', 1);
```

### 6. user_stats (用户统计表)

存储用户行为统计数据。

```sql
CREATE TABLE user_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    click_count INTEGER DEFAULT 0,
    last_clicked DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES navigation_items(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_user_stats_item ON user_stats(item_id);
CREATE INDEX idx_user_stats_clicks ON user_stats(click_count DESC);
CREATE INDEX idx_user_stats_last_clicked ON user_stats(last_clicked DESC);
```

#### 字段说明

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | INTEGER | 主键，自增 | PRIMARY KEY |
| item_id | INTEGER | 导航项 ID | NOT NULL, FK |
| click_count | INTEGER | 点击次数 | 默认 0 |
| last_clicked | DATETIME | 最后点击时间 | 可选 |
| created_at | DATETIME | 创建时间 | 自动设置 |
| updated_at | DATETIME | 更新时间 | 自动设置 |

## 数据库迁移

### 迁移文件结构

```
migrations/
├── 0001_initial_schema.sql
├── 0002_add_search_engines.sql
├── 0003_add_calendar_data.sql
├── 0004_add_user_stats.sql
└── 0005_add_indexes.sql
```

### 初始迁移脚本

```sql
-- migrations/0001_initial_schema.sql
-- 创建分类表
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3b82f6',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建导航项表
CREATE TABLE navigation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    click_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 创建站点配置表
CREATE TABLE site_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 迁移管理工具

```typescript
// utils/migrations.ts
export interface Migration {
  version: string
  name: string
  up: string
  down?: string
}

export class MigrationManager {
  constructor(private db: D1Database) {}
  
  async createMigrationsTable() {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }
  
  async getExecutedMigrations(): Promise<string[]> {
    const result = await this.db.prepare(
      'SELECT version FROM migrations ORDER BY version'
    ).all()
    
    return result.results.map(row => row.version as string)
  }
  
  async executeMigration(migration: Migration) {
    await this.db.exec(migration.up)
    
    await this.db.prepare(
      'INSERT INTO migrations (version, name) VALUES (?, ?)'
    ).bind(migration.version, migration.name).run()
  }
  
  async migrate(migrations: Migration[]) {
    await this.createMigrationsTable()
    const executed = await this.getExecutedMigrations()
    
    for (const migration of migrations) {
      if (!executed.includes(migration.version)) {
        console.log(`Executing migration: ${migration.name}`)
        await this.executeMigration(migration)
      }
    }
  }
}
```

## 数据访问层 (DAL)

### 基础数据访问类

```typescript
// utils/database/base.ts
export abstract class BaseRepository<T> {
  constructor(protected db: D1Database, protected tableName: string) {}
  
  async findById(id: number): Promise<T | null> {
    const result = await this.db.prepare(
      `SELECT * FROM ${this.tableName} WHERE id = ?`
    ).bind(id).first()
    
    return result as T | null
  }
  
  async findAll(options: {
    where?: Record<string, any>
    orderBy?: string
    limit?: number
    offset?: number
  } = {}): Promise<T[]> {
    let sql = `SELECT * FROM ${this.tableName}`
    const params: any[] = []
    
    if (options.where) {
      const conditions = Object.entries(options.where)
        .map(([key, value]) => {
          params.push(value)
          return `${key} = ?`
        })
      sql += ` WHERE ${conditions.join(' AND ')}`
    }
    
    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`
    }
    
    if (options.limit) {
      sql += ` LIMIT ${options.limit}`
      if (options.offset) {
        sql += ` OFFSET ${options.offset}`
      }
    }
    
    const result = await this.db.prepare(sql).bind(...params).all()
    return result.results as T[]
  }
  
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map(() => '?').join(', ')
    
    const result = await this.db.prepare(`
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders})
    `).bind(...values).run()
    
    return result.meta.last_row_id as number
  }
  
  async update(id: number, data: Partial<T>): Promise<boolean> {
    const entries = Object.entries(data)
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ')
    const values = entries.map(([, value]) => value)
    
    const result = await this.db.prepare(`
      UPDATE ${this.tableName} 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(...values, id).run()
    
    return result.changes > 0
  }
  
  async delete(id: number): Promise<boolean> {
    const result = await this.db.prepare(
      `DELETE FROM ${this.tableName} WHERE id = ?`
    ).bind(id).run()
    
    return result.changes > 0
  }
}
```

### 具体仓库实现

```typescript
// utils/database/repositories/CategoryRepository.ts
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  color: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export class CategoryRepository extends BaseRepository<Category> {
  constructor(db: D1Database) {
    super(db, 'categories')
  }
  
  async findBySlug(slug: string): Promise<Category | null> {
    const result = await this.db.prepare(
      'SELECT * FROM categories WHERE slug = ? AND is_active = 1'
    ).bind(slug).first()
    
    return result as Category | null
  }
  
  async findActive(): Promise<Category[]> {
    return this.findAll({
      where: { is_active: 1 },
      orderBy: 'sort_order ASC, name ASC'
    })
  }
  
  async updateSortOrder(updates: Array<{ id: number; sort_order: number }>) {
    const statements = updates.map(({ id, sort_order }) =>
      this.db.prepare(
        'UPDATE categories SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(sort_order, id)
    )
    
    await this.db.batch(statements)
  }
}
```

```typescript
// utils/database/repositories/NavigationItemRepository.ts
export interface NavigationItem {
  id: number
  category_id: number
  title: string
  url: string
  description?: string
  icon?: string
  sort_order: number
  is_active: boolean
  click_count: number
  created_at: string
  updated_at: string
}

export class NavigationItemRepository extends BaseRepository<NavigationItem> {
  constructor(db: D1Database) {
    super(db, 'navigation_items')
  }
  
  async findByCategory(categoryId: number): Promise<NavigationItem[]> {
    return this.findAll({
      where: { category_id: categoryId, is_active: 1 },
      orderBy: 'sort_order ASC, title ASC'
    })
  }
  
  async findPopular(limit = 10): Promise<NavigationItem[]> {
    return this.findAll({
      where: { is_active: 1 },
      orderBy: 'click_count DESC, title ASC',
      limit
    })
  }
  
  async incrementClickCount(id: number): Promise<void> {
    await this.db.prepare(`
      UPDATE navigation_items 
      SET click_count = click_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(id).run()
  }
  
  async search(query: string): Promise<NavigationItem[]> {
    const result = await this.db.prepare(`
      SELECT * FROM navigation_items 
      WHERE is_active = 1 
        AND (title LIKE ? OR description LIKE ? OR url LIKE ?)
      ORDER BY 
        CASE 
          WHEN title LIKE ? THEN 1
          WHEN description LIKE ? THEN 2
          ELSE 3
        END,
        click_count DESC
    `).bind(
      `%${query}%`, `%${query}%`, `%${query}%`,
      `%${query}%`, `%${query}%`
    ).all()
    
    return result.results as NavigationItem[]
  }
}
```

## 数据库服务层

### 服务类封装

```typescript
// server/utils/DatabaseService.ts
export class DatabaseService {
  private categoryRepo: CategoryRepository
  private navigationRepo: NavigationItemRepository
  private configRepo: ConfigRepository
  
  constructor(private db: D1Database) {
    this.categoryRepo = new CategoryRepository(db)
    this.navigationRepo = new NavigationItemRepository(db)
    this.configRepo = new ConfigRepository(db)
  }
  
  // 分类相关
  async getCategories() {
    return this.categoryRepo.findActive()
  }
  
  async getCategoryBySlug(slug: string) {
    return this.categoryRepo.findBySlug(slug)
  }
  
  // 导航项相关
  async getNavigationItems(categoryId?: number) {
    if (categoryId) {
      return this.navigationRepo.findByCategory(categoryId)
    }
    return this.navigationRepo.findAll({ where: { is_active: 1 } })
  }
  
  async getPopularItems(limit = 10) {
    return this.navigationRepo.findPopular(limit)
  }
  
  async searchItems(query: string) {
    return this.navigationRepo.search(query)
  }
  
  async recordClick(itemId: number) {
    await this.navigationRepo.incrementClickCount(itemId)
  }
  
  // 配置相关
  async getConfig(key: string) {
    return this.configRepo.findByKey(key)
  }
  
  async getPublicConfig() {
    return this.configRepo.findPublic()
  }
  
  // 统计相关
  async getStats() {
    const totalCategories = await this.db.prepare(
      'SELECT COUNT(*) as count FROM categories WHERE is_active = 1'
    ).first()
    
    const totalItems = await this.db.prepare(
      'SELECT COUNT(*) as count FROM navigation_items WHERE is_active = 1'
    ).first()
    
    const totalClicks = await this.db.prepare(
      'SELECT SUM(click_count) as total FROM navigation_items'
    ).first()
    
    return {
      categories: totalCategories?.count || 0,
      items: totalItems?.count || 0,
      clicks: totalClicks?.total || 0
    }
  }
}
```

### 数据库连接管理

```typescript
// server/utils/database.ts
let dbInstance: DatabaseService | null = null

export function getDatabase(env: any): DatabaseService {
  if (!dbInstance) {
    if (!env.DB) {
      throw new Error('Database binding not found')
    }
    dbInstance = new DatabaseService(env.DB)
  }
  return dbInstance
}

// Nuxt 插件
export default defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    // 为每个请求提供数据库实例
    event.context.db = getDatabase(event.context.cloudflare.env)
  })
})
```

## 数据验证和类型安全

### Zod 验证模式

```typescript
// types/database.ts
import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  icon: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#3b82f6'),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true)
})

export const NavigationItemSchema = z.object({
  id: z.number().int().positive().optional(),
  category_id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  url: z.string().url(),
  description: z.string().max(1000).optional(),
  icon: z.string().url().optional(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true)
})

export type Category = z.infer<typeof CategorySchema>
export type NavigationItem = z.infer<typeof NavigationItemSchema>
export type CreateCategory = z.infer<typeof CategorySchema.omit({ id: true })>
export type CreateNavigationItem = z.infer<typeof NavigationItemSchema.omit({ id: true })>
```

### 数据验证中间件

```typescript
// server/middleware/validation.ts
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return defineEventHandler(async (event) => {
    if (event.node.req.method !== 'GET') {
      const body = await readBody(event)
      
      try {
        const validatedData = schema.parse(body)
        event.context.validatedBody = validatedData
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Validation failed',
            data: error.issues
          })
        }
        throw error
      }
    }
  })
}
```

## 性能优化

### 查询优化

```sql
-- 复合索引优化
CREATE INDEX idx_navigation_category_active_sort 
ON navigation_items(category_id, is_active, sort_order);

-- 覆盖索引
CREATE INDEX idx_navigation_list 
ON navigation_items(category_id, is_active, sort_order, title, url, description);

-- 部分索引
CREATE INDEX idx_navigation_active 
ON navigation_items(sort_order) 
WHERE is_active = 1;
```

### 缓存策略

```typescript
// utils/cache.ts
export class DatabaseCache {
  private cache = new Map<string, { data: any; expires: number }>()
  
  set(key: string, data: any, ttl = 300000) { // 5分钟默认TTL
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    })
  }
  
  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl = 300000
  ): Promise<T> {
    const cached = this.get(key)
    if (cached) return cached
    
    const data = await fetcher()
    this.set(key, data, ttl)
    return data
  }
}

// 使用示例
const cache = new DatabaseCache()

export async function getCachedCategories(db: DatabaseService) {
  return cache.getOrSet(
    'categories:active',
    () => db.getCategories(),
    600000 // 10分钟缓存
  )
}
```

## 备份和恢复

### 数据导出

```typescript
// utils/backup.ts
export class DatabaseBackup {
  constructor(private db: D1Database) {}
  
  async exportData() {
    const tables = ['categories', 'navigation_items', 'search_engines', 'site_config']
    const backup: Record<string, any[]> = {}
    
    for (const table of tables) {
      const result = await this.db.prepare(`SELECT * FROM ${table}`).all()
      backup[table] = result.results
    }
    
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: backup
    }
  }
  
  async importData(backupData: any) {
    const { data } = backupData
    
    // 清空现有数据
    await this.db.exec('DELETE FROM navigation_items')
    await this.db.exec('DELETE FROM categories')
    await this.db.exec('DELETE FROM search_engines')
    await this.db.exec('DELETE FROM site_config')
    
    // 导入数据
    for (const [table, records] of Object.entries(data)) {
      for (const record of records as any[]) {
        const keys = Object.keys(record).filter(key => key !== 'id')
        const values = keys.map(key => record[key])
        const placeholders = keys.map(() => '?').join(', ')
        
        await this.db.prepare(`
          INSERT INTO ${table} (${keys.join(', ')})
          VALUES (${placeholders})
        `).bind(...values).run()
      }
    }
  }
}
```

## 监控和日志

### 数据库监控

```typescript
// utils/monitoring.ts
export class DatabaseMonitor {
  constructor(private db: D1Database) {}
  
  async getPerformanceMetrics() {
    const queries = [
      { name: 'slow_queries', sql: 'PRAGMA compile_options' },
      { name: 'table_info', sql: 'SELECT name FROM sqlite_master WHERE type="table"' },
      { name: 'index_info', sql: 'SELECT name FROM sqlite_master WHERE type="index"' }
    ]
    
    const metrics: Record<string, any> = {}
    
    for (const query of queries) {
      const start = Date.now()
      const result = await this.db.prepare(query.sql).all()
      const duration = Date.now() - start
      
      metrics[query.name] = {
        duration,
        rows: result.results.length
      }
    }
    
    return metrics
  }
  
  async logQuery(sql: string, params: any[], duration: number) {
    if (duration > 1000) { // 记录超过1秒的查询
      console.warn('Slow query detected:', {
        sql,
        params,
        duration,
        timestamp: new Date().toISOString()
      })
    }
  }
}
```

## 总结

ztaoHub 的数据库设计具有以下特点：

1. **规范化设计**: 遵循数据库设计范式，减少数据冗余
2. **性能优化**: 合理的索引设计和查询优化
3. **类型安全**: 使用 TypeScript 和 Zod 确保类型安全
4. **可扩展性**: 模块化的仓库模式，易于扩展新功能
5. **数据完整性**: 外键约束和数据验证确保数据一致性
6. **缓存策略**: 多层缓存提升查询性能
7. **监控日志**: 完善的监控和日志系统

这种设计确保了数据库的高性能、高可用性和易维护性，为 ztaoHub 提供了坚实的数据基础。

---

*最后更新: 2024年1月*