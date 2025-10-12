# fairyCity - 个人导航网站开发文档

## 项目简介

fairyCity 是一个基于 Nuxt 4 框架开发的现代化个人导航网站，提供简洁美观的网址导航服务。项目采用响应式设计，支持多种搜索引擎集成，并具备黄历显示等特色功能。

### 核心特性

- 🚀 **现代化技术栈**: Nuxt 4 + NuxtUI + TypeScript
- 📱 **响应式设计**: 支持桌面端、平板和移动端
- 🎨 **美观界面**: 毛玻璃效果、渐变背景、现代化UI
- 🔍 **多搜索引擎**: 集成百度、谷歌、必应等主流搜索
- 📅 **黄历功能**: 传统文化元素融入现代设计
- ☁️ **云端部署**: Cloudflare Pages + D1 数据库
- ⚡ **高性能**: SSR/SSG 优化，快速加载

## 技术架构

### 前端技术栈

- **框架**: Nuxt 4 (Vue 3 + Vite)
- **UI库**: NuxtUI (基于 Tailwind CSS)
- **语言**: TypeScript
- **样式**: Tailwind CSS + CSS Modules
- **状态管理**: Pinia + useState
- **图标**: Heroicons + Lucide

### 后端技术栈

- **运行时**: Nitro (Nuxt Server Engine)
- **数据库**: Cloudflare D1 (SQLite)
- **API**: RESTful API + Server Routes
- **认证**: JWT (可选)
- **缓存**: Cloudflare KV (可选)

### 部署平台

- **托管**: Cloudflare Pages
- **数据库**: Cloudflare D1
- **CDN**: Cloudflare CDN
- **域名**: Cloudflare DNS

## 项目结构

基于 Nuxt 4 的最新规范，项目采用 `app/` 目录作为默认的 `srcDir`：

```
nuxt4-nav/
├── .output/              # 构建输出目录
├── .nuxt/                # Nuxt 开发时生成的文件
├── app/                  # Nuxt 4 应用目录 (srcDir)
│   ├── app.vue          # 根组件
│   ├── app.config.ts    # 应用配置 (可选)
│   ├── assets/          # 静态资源
│   │   └── css/         # 样式文件
│   │       └── main.css # 主样式文件
│   ├── components/      # Vue 组件
│   │   ├── Header/      # 头部组件
│   │   │   ├── Navigation.vue
│   │   │   └── TimeDisplay.vue
│   │   ├── Search/      # 搜索组件
│   │   │   ├── SearchEngine.vue
│   │   │   └── SearchBox.vue
│   │   ├── Navigation/  # 导航组件
│   │   │   ├── CategoryGrid.vue
│   │   │   └── NavigationCard.vue
│   │   ├── Content/     # 内容组件
│   │   │   ├── ContentSection.vue
│   │   │   └── Calendar.vue
│   │   └── UI/          # 通用UI组件
│   ├── composables/     # 组合式函数
│   │   ├── useNavigation.ts
│   │   ├── useSearch.ts
│   │   └── useCalendar.ts
│   ├── layouts/         # 布局组件
│   │   └── default.vue  # 默认布局
│   ├── middleware/      # 路由中间件
│   ├── pages/           # 页面路由
│   │   ├── index.vue    # 首页
│   │   └── admin/       # 管理后台页面
│   ├── plugins/         # 插件
│   └── utils/           # 工具函数
├── server/              # 服务端代码 (rootDir 级别)
│   ├── api/             # API 路由
│   ├── middleware/      # 服务端中间件
│   ├── plugins/         # 服务端插件
│   └── utils/           # 服务端工具函数
├── public/              # 公共静态文件 (rootDir 级别)
│   ├── favicon.ico      # 网站图标
│   └── robots.txt       # 搜索引擎爬虫配置
├── docs/                # 项目文档
│   ├── README.md        # 项目文档
│   ├── API.md           # API 文档
│   ├── ARCHITECTURE.md  # 架构文档
│   ├── COMPONENTS.md    # 组件文档
│   ├── DATABASE.md      # 数据库文档
│   ├── DEPLOYMENT.md    # 部署文档
│   └── SETUP.md         # 安装配置文档
├── design/              # 设计文件
│   └── prototype.html   # 原型设计
├── types/               # TypeScript 类型定义 (可选)
├── nuxt.config.ts       # Nuxt 配置文件
├── package.json         # 项目依赖配置
├── pnpm-lock.yaml       # 依赖锁定文件
├── tsconfig.json        # TypeScript 配置
├── eslint.config.mjs    # ESLint 配置
├── .gitignore           # Git 忽略文件
├── .npmrc               # npm 配置
└── README.md            # 项目说明
```

### Nuxt 4 目录结构说明

#### 核心变化
- **`app/` 目录**: Nuxt 4 的默认 `srcDir`，包含所有应用相关代码
- **`~` 别名**: 现在指向 `app/` 目录 (例如: `~/components` = `app/components/`)
- **根级目录**: `server/`、`public/`、`modules/` 等目录位于项目根目录

#### 目录职责

**应用级目录 (app/)**:
- `app.vue`: 应用根组件
- `app.config.ts`: 应用配置文件
- `assets/`: 需要构建处理的静态资源
- `components/`: Vue 组件
- `composables/`: 组合式函数
- `layouts/`: 布局组件
- `middleware/`: 路由中间件
- `pages/`: 页面路由
- `plugins/`: 客户端/服务端插件
- `utils/`: 工具函数

**根级目录**:
- `server/`: 服务端代码 (API、中间件等)
- `public/`: 静态文件 (直接复制到构建输出)
- `nuxt.config.ts`: Nuxt 配置文件
- 其他配置文件 (package.json、tsconfig.json 等)

## 核心功能模块

### 1. 头部导航 (Header)

**功能特性**:
- Logo 和网站标题显示
- 实时时间显示
- 毛玻璃背景效果
- 响应式导航菜单

**技术实现**:
```vue
<template>
  <header class="header-glass">
    <div class="container">
      <div class="logo-section">
        <h1>fairyCity</h1>
      </div>
      <div class="time-display">
        <TimeDisplay />
      </div>
    </div>
  </header>
</template>
```

### 2. 搜索引擎 (SearchEngine)

**功能特性**:
- 多搜索引擎切换 (百度、谷歌、必应等)
- 搜索建议和自动完成
- 搜索历史记录
- 快捷键支持

**数据结构**:
```typescript
interface SearchEngine {
  id: string
  name: string
  url: string
  icon: string
  placeholder: string
  suggestions?: boolean
}
```

### 3. 导航网格 (NavigationGrid)

**功能特性**:
- 分类导航展示
- 卡片式布局
- 悬停效果
- 拖拽排序 (管理员)

**响应式设计**:
- 桌面端: 6列网格
- 平板端: 4列网格  
- 移动端: 2列网格

### 4. 内容区域 (ContentSection)

**功能特性**:
- 动态内容展示
- Markdown 支持
- 图片懒加载
- SEO 优化

### 5. 黄历组件 (Calendar)

**功能特性**:
- 农历日期显示
- 宜忌事项展示
- 传统节日提醒
- 自定义样式

## 样式系统

### CSS Reset/Normalize

使用现代化的 CSS Reset 确保跨浏览器一致性:

```css
/* assets/css/reset.css */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}
```

### 主题配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/css/reset.css'],
  ui: {
    primary: 'blue',
    gray: 'slate'
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          maxWidth: {
            'container': '1280px'
          },
          backdropBlur: {
            'glass': '10px'
          }
        }
      }
    }
  }
})
```

### 响应式断点

```css
/* Tailwind CSS 断点 */
sm: 640px   /* 移动端 */
md: 768px   /* 平板端 */
lg: 1024px  /* 桌面端 */
xl: 1280px  /* 大屏幕 */
2xl: 1536px /* 超大屏幕 */
```

## 数据库设计

### 表结构设计

#### 1. 导航分类表 (navigation_categories)

```sql
CREATE TABLE navigation_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. 导航项目表 (navigation_items)

```sql
CREATE TABLE navigation_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  favicon_url TEXT,
  sort_order INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES navigation_categories(id)
);
```

#### 3. 搜索引擎表 (search_engines)

```sql
CREATE TABLE search_engines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url_template TEXT NOT NULL,
  icon TEXT,
  placeholder TEXT,
  is_default BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. 网站配置表 (site_config)

```sql
CREATE TABLE site_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'string',
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. 黄历数据表 (calendar_data)

```sql
CREATE TABLE calendar_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  lunar_date TEXT,
  suitable_activities TEXT,
  unsuitable_activities TEXT,
  festival TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API 接口设计

### RESTful API 规范

#### 导航相关接口

```typescript
// GET /api/navigation/categories
// 获取所有导航分类
interface CategoryResponse {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  items: NavigationItem[]
}

// GET /api/navigation/items
// 获取导航项目列表
interface NavigationItem {
  id: number
  title: string
  url: string
  description?: string
  icon?: string
  category: string
}

// POST /api/navigation/items
// 创建导航项目 (管理员)
interface CreateNavigationItem {
  title: string
  url: string
  description?: string
  category_id: number
}
```

#### 搜索引擎接口

```typescript
// GET /api/search/engines
// 获取搜索引擎列表
interface SearchEngine {
  id: number
  name: string
  url_template: string
  icon?: string
  placeholder: string
  is_default: boolean
}

// GET /api/search/suggestions?q={query}&engine={engine}
// 获取搜索建议
interface SearchSuggestion {
  query: string
  suggestions: string[]
}
```

#### 黄历接口

```typescript
// GET /api/calendar/today
// 获取今日黄历
interface CalendarData {
  date: string
  lunar_date: string
  suitable_activities: string[]
  unsuitable_activities: string[]
  festival?: string
}
```

## 开发环境配置

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git >= 2.0.0

### 本地开发设置

1. **克隆项目**
```bash
git clone <repository-url>
cd nuxt4-nav
```

2. **安装依赖**
```bash
pnpm install
```

3. **环境变量配置**
```bash
# .env
NUXT_SECRET_KEY=your-secret-key
DATABASE_URL=your-d1-database-url
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
```

4. **启动开发服务器**
```bash
pnpm dev
```

### 代码质量工具

#### ESLint 配置

```javascript
// eslint.config.mjs
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    typescript: true,
    stylistic: true
  }
})
```

#### Prettier 配置

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

## 性能优化

### 图片优化

```vue
<template>
  <NuxtImg
    :src="imageUrl"
    :alt="altText"
    loading="lazy"
    format="webp"
    quality="80"
    sizes="sm:100vw md:50vw lg:400px"
  />
</template>
```

### 代码分割

```typescript
// 路由级别的代码分割
const AdminPanel = defineAsyncComponent(() => import('~/components/AdminPanel.vue'))

// 组件级别的懒加载
const HeavyComponent = defineAsyncComponent({
  loader: () => import('~/components/HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  delay: 200,
  timeout: 3000
})
```

### 缓存策略

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/': { prerender: true },
      '/api/**': { cors: true, headers: { 'cache-control': 's-maxage=60' } },
      '/admin/**': { ssr: false, index: false }
    }
  }
})
```

## SEO 优化

### Meta 标签管理

```vue
<script setup>
useSeoMeta({
  title: 'fairyCity - 上网从这里开始',
  ogTitle: 'fairyCity - 个人导航网站',
  description: 'fairyCity提供最实用的网址导航服务，整合常用网站，让上网更简单高效。',
  ogDescription: 'fairyCity提供最实用的网址导航服务，整合常用网站，让上网更简单高效。',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
})
</script>
```

### 结构化数据

```vue
<script setup>
useSchemaOrg([
  defineWebSite({
    name: 'fairyCity',
    url: 'https://ztaohub.com',
    description: 'fairyCity提供最实用的网址导航服务'
  }),
  defineWebPage({
    '@type': 'WebPage',
    name: 'fairyCity - 个人导航网站',
    url: 'https://ztaohub.com'
  })
])
</script>
```

## 部署指南

### Cloudflare Pages 部署

1. **构建配置**
```toml
# wrangler.toml
name = "ztaohub"
compatibility_date = "2024-01-01"

[build]
command = "pnpm build"
publish = ".output/public"

[[d1_databases]]
binding = "DB"
database_name = "ztaohub-db"
database_id = "your-database-id"
```

2. **环境变量设置**
- 在 Cloudflare Pages 控制台设置环境变量
- 配置 D1 数据库绑定
- 设置自定义域名

3. **数据库迁移**
```bash
# 创建 D1 数据库
wrangler d1 create ztaohub-db

# 执行迁移
wrangler d1 migrations apply ztaohub-db
```

## 开发最佳实践

### 组件开发规范

1. **组件命名**: 使用 PascalCase
2. **文件结构**: 单文件组件 (.vue)
3. **Props 定义**: 使用 TypeScript 接口
4. **事件命名**: 使用 kebab-case
5. **样式作用域**: 使用 scoped 或 CSS Modules

### Git 工作流

1. **分支策略**: Git Flow
2. **提交规范**: Conventional Commits
3. **代码审查**: Pull Request
4. **自动化**: GitHub Actions

### 测试策略

1. **单元测试**: Vitest + Vue Test Utils
2. **集成测试**: Playwright
3. **E2E 测试**: Cypress
4. **性能测试**: Lighthouse CI

## 故障排除

### 常见问题

1. **构建失败**: 检查 Node.js 版本和依赖
2. **样式问题**: 确认 Tailwind CSS 配置
3. **API 错误**: 检查数据库连接和权限
4. **部署问题**: 验证环境变量和构建配置

### 调试工具

1. **Vue DevTools**: 组件调试
2. **Nuxt DevTools**: 应用分析
3. **Network Tab**: API 请求调试
4. **Console**: 错误日志查看

## 贡献指南

### 开发流程

1. Fork 项目仓库
2. 创建功能分支
3. 编写代码和测试
4. 提交 Pull Request
5. 代码审查和合并

### 代码规范

- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 编写单元测试
- 更新文档

## 许可证

MIT License - 详见 LICENSE 文件

## 联系方式

- 项目地址: [GitHub Repository]
- 问题反馈: [Issues]
- 讨论交流: [Discussions]

---

*最后更新: 2024年1月*